var flippedCards = [];
var matchedCards = 0;
var pairs = 4;
var timerInterval = null;
var timeElapsed = 0;

function startTimer() {
    timeElapsed = 0;
    document.getElementById("timer").textContent = timeElapsed;
    timerInterval = setInterval(function () {
        timeElapsed++;
        document.getElementById("timer").textContent = timeElapsed;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function generateCards() {
    var cards = [];
    for (var i = 1; i <= pairs; i++) {
        cards.push(i, i);
    }
    return cards;
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function flipCard(card) {
    if (card.classList.contains("flipped") || card.classList.contains("matched")) {
        return;
    }

    card.classList.add("flipped");
    card.textContent = card.dataset.cardValue;  
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    var [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.cardValue === secondCard.dataset.cardValue) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedCards++;

        flippedCards = []; 
        if (matchedCards === pairs) {
            stopTimer();
            setTimeout(function () {
                alert(`Congratulations, ${document.getElementById("player-name-display").textContent}! You finished the game in ${timeElapsed} seconds.`);
                document.getElementById("restart-game").style.display = "block";
            }, 500);
        }
    } else {
       
        setTimeout(function () {
            firstCard.classList.remove("flipped");
            firstCard.textContent = ''; 
            secondCard.classList.remove("flipped");
            secondCard.textContent = '';
            flippedCards = []; 
        }, 1000); 
    }
}

function startGame(event) {
    event.preventDefault();
    var playerName = document.getElementById("player-name").value.trim();
    var pairsInput = parseInt(document.getElementById("pairs-input").value, 10);

    if (!pairsInput || pairsInput > 30 || pairsInput < 2) {
        alert("Please enter a valid number of pairs between 2 and 30.");
        return;
    }

    pairs = pairsInput;
    document.getElementById("player-name-display").textContent = `Player: ${playerName}`;
    document.getElementById("game-setup").style.display = "none";
    document.getElementById("player-info").style.display = "block";

    var cards = shuffle(generateCards());
    var board = document.getElementById("board");
    board.innerHTML = ''; 
    board.style.gridTemplateColumns = `repeat(${Math.min(pairs, 6)}, 100px)`; 

    
    cards.forEach(function (cardValue) {
        var card = document.createElement("div");
        card.classList.add("card");
        card.dataset.cardValue = cardValue;
        card.onclick = function() { flipCard(card); };
        board.appendChild(card);
    });

    flippedCards = [];
    matchedCards = 0;
    startTimer();
}

function restartGame() {
    stopTimer();
    document.getElementById("game-setup").style.display = "block";
    document.getElementById("player-info").style.display = "none";
    document.getElementById("restart-game").style.display = "none";
    document.getElementById("pairs-input").value = '';
    document.getElementById("player-name").value = '';
}

document.getElementById("setup-form").onsubmit = startGame;
document.getElementById("restart-game").onclick = restartGame;
