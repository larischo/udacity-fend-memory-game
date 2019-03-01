const iconList = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];
const cardsList = document.querySelector(".deck");
const stars = document.querySelector(".stars");
const time = document.querySelector(".timer");
let counter;
let timer;
let seconds;
let matchedCards;
let openCards;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//shuffle the card icons
function shuffleCards() {
    const shuffledIcons = shuffle(iconList);
    const cardsFragment = document.createDocumentFragment();
    //create cards & HTML
    for (let i = 0; i < shuffledIcons.length; i++) {
        const card = document.createElement("li");
        card.setAttribute("class", "card");
        card.innerHTML = "<i class='" + shuffledIcons[i] + "'></i>";
        cardsFragment.appendChild(card);
    }
    cardsList.appendChild(cardsFragment);
}

//start game
function start() {
    seconds = 0;
    setCounter(0);
    shuffleCards();
    clickCards();
    startTimer();
}

function restart() {
    //delete cards
    cardsList.innerHTML = "";
    //set rating to default
    stars.children[0].className="";
    stars.children[1].className="";
    //restart timer
    time.innerHTML = "0";
    clearInterval(timer);
    start();
}

//set moves in score-panel
function setCounter(counter) {
    var move = document.querySelector(".moves");
    move.innerHTML = counter;
    setRating();
}

//set rating stars, more then 12 & 24 moves reduces rating
function setRating() {
    var stars = document.querySelectorAll(".stars");
    if (counter == 12) {
        stars[0].children[0].className="hide";
        stars[1].children[0].className="hide";
    }
    if (counter == 24) {
        stars[0].children[1].className="hide";
        stars[1].children[1].className="hide";
    }
}

//start timer
function startTimer() {
    timer = setInterval(function () {
        seconds += 1;
        //set timer in score-panel
        time.innerHTML = seconds;

    }, 1000);
}

function verifyCards() {
    //no match
    if (openCards[0].firstChild.className != openCards[1].firstChild.className) {
        setTimeout(function () {
            for (let i = 0; i < openCards.length; i++) {
                openCards[i].className="card";
            }
            openCards = [];
        }, 500)

    } else {
        //if the cards do match, lock the cards in the open position
        openCards[0].className="card match";
        openCards[1].className="card match";
        openCards = [];
        matchedCards += 2;
        //wining if all cards match
        if (matchedCards == iconList.length) {
        win();
        }
    }

}

//if all cards have matched, display a message with the final score
function win() {
    //stop timer
    clearInterval(timer);
    //display modal
    document.querySelector(".modal").style.top = "0";
    document.querySelector("#totalSeconds").innerHTML = seconds;
    document.querySelector("#totalMoves").innerHTML = counter;  
}


function clickCards() {
    const cards = document.querySelectorAll(".card");
    counter = 0;
    matchedCards = 0;
    openCards = [];
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", function () {
            console.log("click");
            if (this.className == "card") {
                //display card symbol
                this.setAttribute("class", "card open show");
                //add card to list of open cards
                openCards.push(this);
                //if the list already has another card, check to see if the two cards match
                if (openCards.length == 2) {
                    //add a move 
                    setCounter(++counter);
                    verifyCards();
                }
            }
        });
    }
}

//restart from score-panel
document.querySelector(".restart").addEventListener("click", function () {
    restart();
});

//restart from modal
document.querySelector(".newGame").addEventListener("click", function () {
    //hide modal
    document.querySelector(".modal").style.top = "-150%";
    restart();
});

//start the game
start();
