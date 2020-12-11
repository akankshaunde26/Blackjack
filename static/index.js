let blackjackGame = {
    "you" : {"scoreSpan" : "#your-score", "div":"#your-card-images", "score":0},
    "dealer": {"scoreSpan": "#dealer-score", "div":"#dealer-card-images", "score": 0},
    "cards": ["2","3","4","5","6","7","8","9","10","J","Q","K","A"],
    "cardValues" : {"2": 2, "3" : 3, "4":4, "5": 5, "6": 6, "7" : 7, "8" : 8, "9": 9, "10":10, "K" : 10, "J" :10, "Q" : 10, "A":[1,11]},
    "betAmount" : 2500,
    "afterbet" : 0,
    "gain" : 0,
    "loss": 0,
    "turnsOver":false,
    "isStand": false,
}

//initializing player objects
const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];
const DRAW = 0;

// audio sounds
const hitSound = new Audio("static/sounds bj/swish.m4a");
const awwSound = new Audio("static/sounds bj/aww.mp3");
const cashSound = new Audio("static/sounds bj/cash.mp3");
const tickSound = new Audio("static/sounds bj/tick.mp3");


document.querySelector("#bet-button").addEventListener("click",betBtn);

function betBtn() {
    let afterbet = blackjackGame["betAmount"] -= 10;  
    document.querySelector("#bet").textContent = "$" + afterbet;
    blackjackGame["afterbet"] = 2500 - afterbet;
    console.log(blackjackGame["afterbet"]);
    tickSound.play();
   
};     




$("#hit-button").on("click", function() {
    if(blackjackGame["isStand"] === false) {
        let currentCard = randomCard();
        displayCard(currentCard,YOU);
        updateScore(currentCard,YOU);
        displayScore(YOU);
    }
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

$("#stand-button").on("click",async function() {
    blackjackGame["isStand"] = true;

    while(DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
        let currentCard = randomCard();
        displayCard(currentCard,DEALER);
        updateScore(currentCard,DEALER);
        displayScore(DEALER);
        await sleep(1000);
    }
    
    blackjackGame["turnsOver"] = true;
    displayWinner(calcWinner());

});



$("#deal-button").on("click", function() {
    if(blackjackGame["turnsOver"] === true) {
        blackjackGame["isStand"] = false;
        let yourImages = document.querySelector("#your-card-images").querySelectorAll("img");
        let dealerImages = document.querySelector("#dealer-card-images").querySelectorAll("img");
        for(let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }

        for(let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        YOU["score"] = 0;
        DEALER["score"] = 0;
        

        document.querySelector("#your-score").textContent = 0;
        document.querySelector("#dealer-score").textContent = 0;
        document.querySelector("#your-score").style.color = "white";
        document.querySelector("#dealer-score").style.color = "white";

        document.querySelector("#end-result").textContent = "Good Luck!";
        document.querySelector("#end-result").style.color = "white";
        
        // document.querySelector("#gain").textContent = "";
        // document.querySelector("#loss").textContent = "";

        blackjackGame["turnsOver"] = true;
    }

})

function randomCard() {
    return blackjackGame["cards"][Math.floor(Math.random() * 13)];
}

function displayCard(currentCard,currentPlayer) {
    if(currentPlayer["score"] <= 21) {
        let cardImage = document.createElement("img");
        cardImage.src = `static/images bj/${currentCard}.png`;
        document.querySelector(currentPlayer["div"]).appendChild(cardImage);
        hitSound.play();
    }
}

function updateScore(currentCard,currentPlayer) {
    if(currentCard === "A"){
        if(currentPlayer["score"] + blackjackGame["cardValues"][currentCard][1] <= 21) {
            currentPlayer["score"] += blackjackGame["cardValues"][currentCard][1];
        } else {
            currentPlayer["score"] += blackjackGame["cardValues"][currentCard][0];
        }
    } else  {
         currentPlayer["score"] += blackjackGame["cardValues"][currentCard];
      }

}

function displayScore(currentPlayer) {
    if(currentPlayer["score"] <= 21) {
        document.querySelector(currentPlayer["scoreSpan"]).textContent = currentPlayer["score"];
    } else{
        document.querySelector(currentPlayer["scoreSpan"]).textContent = "BUST!";
        document.querySelector(currentPlayer["scoreSpan"]).style.color = "red";
    }
}


function calcWinner () {
    let winner;
    if(YOU["score"] <= 21) {
        if(YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
            winner = YOU;
        } else if(YOU["score"] < DEALER["score"]) {
            winner = DEALER;
        } else if(YOU["score"] === DEALER ["score"]) {
            winner = DRAW;
        }
    } else if(YOU["score"] > 21 && DEALER["score"] <= 21) {
        winner = DEALER;
    } else if(YOU["score"] > 21 && DEALER["score"] > 21) {
        winner = DRAW;
    }

    return winner;
}


function displayWinner(winner) {
    if(blackjackGame["turnsOver"] === true) {
        if(winner === YOU) {
            document.querySelector("#end-result").textContent = "YOU WON!";
            document.querySelector("#end-result").style.color = "chartreuse";
            blackjackGame["gain"] += blackjackGame["afterbet"] * 2;
            document.querySelector("#gain").textContent = blackjackGame["gain"];
            blackjackGame["betAmount"] += blackjackGame["gain"];
            document.querySelector("#bet").textContent = blackjackGame["betAmount"];
            cashSound.play();
        } else if(winner === DEALER) {
            document.querySelector("#end-result").textContent = "YOU LOST!";
            document.querySelector("#end-result").style.color = "red";
            blackjackGame["loss"] += blackjackGame["afterbet"];
            document.querySelector("#loss").textContent = blackjackGame["loss"];
            blackjackGame["betAmount"] -= blackjackGame["loss"];
            document.querySelector("#bet").textContent = blackjackGame["betAmount"];
            awwSound.play();
        } else if(winner === DRAW){
            document.querySelector("#end-result").textContent = "IT'S A DRAW";
        } 
    }
    
}



