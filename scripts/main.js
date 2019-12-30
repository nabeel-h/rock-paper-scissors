let gameTracker = {
    hasGameStarted: false,
    playerScore: 0,
    computerScore: 0,
    draws: 0,
    roundCount: 0
};

const scores = Array.from(document.querySelectorAll('.vanillaScore'));
  scores.forEach(score => score.addEventListener('animationend', removeScoreTransition));

const resetLogBtn = document.querySelector("#resetLogBtn");
resetLogBtn.addEventListener('click', clearGameLog);

const restartCurrentGameBtn = document.querySelector("#restartCurrGameBtn");
restartCurrentGameBtn.addEventListener('click', restartCurrentGame);

const playerInputButtons = document.querySelectorAll(".playerInputBtn");
playerInputButtons.forEach((button) => {
    button.addEventListener("click", function(){
        playGame(button.value);});
});

function updateGameStatus (status) {
    gameStatus.textContent = status;
};

function updatePlayerScore (score) {
    const playerScore = document.querySelector("#playerScore");
    if (playerScore.textContent.split(":")[1] == score) {
        return;
    };
    let newPlayerScore = playerScore.textContent.split(":")[0] + ": " + score;
    playerScore.textContent = newPlayerScore;
    playerScore.classList.add("scoreTransition");
};

function updateDraws (score) {
    const draws = document.querySelector("#draws");
    if (draws.textContent.split(":")[1] == score) {
        return;
    };
    let newDraws = draws.textContent.split(":")[0] + ": " + score;
    draws.textContent = newDraws;
    draws.classList.add("scoreTransition");
};

function updateComputerScore (score) {
    const computerScore = document.querySelector("#computerScore");
    if (computerScore.textContent.split(":")[1] == score) {
        return;
    };
    let newComputerScore = computerScore.textContent.split(":")[0] + ": " + score;
    computerScore.textContent = newComputerScore;
    computerScore.classList.add("scoreTransition");
};

function updateGameLog (logLine) {
    const gameLog = document.querySelector("#gameOutputs");
    const logLineP = document.createElement('p');
    logLineP.textContent = logLine;

    if (logLine.search("Lose") >= 0 || logLine.search("Lost") >= 0 ) {
        logLineP.classList.add("gameLogLose");
    } else if (logLine.search("Win") >= 0 || logLine.search("Won") >= 0) {
        logLineP.classList.add("gameLogWin");
    } else if (logLine.search("Draw") >= 0) {
        logLineP.classList.add("gameLogDraw");   
    };

    gameLog.append(logLineP);
};

function clearGameTracker () {
    gameTracker.hasGameStarted = false;
    gameTracker.playerScore = 0;
    gameTracker.computerScore = 0;
    gameTracker.draws = 0;
    gameTracker.roundCount = 0;
    updateGameStatus("Choose Rock, Paper, Scissors to begin!")
};

function clearGameLog () {
    const gameLog = document.querySelector("#gameOutputs");
    gameLog.textContent = "";
};

function restartCurrentGame() {
    updatePlayerScore(0);
    updateComputerScore(0);
    updateDraws(0);
    clearGameTracker();
    updateGameLog("Game Reset");
    updateScroll();
};

function playGame(playerSelection) {
    playerSelection = playerSelection.toLowerCase();
    let computerSelection = getComputerSelection();
    
    if (!(gameTracker.hasGameStarted)) {
        updateGameLog("Starting a new game...");
        gameTracker.hasGameStarted = true;
    };

    let currRound = gameTracker.roundCount + 1;
    updateGameLog(`Round ${currRound}`);
    updateGameStatus(`Round ${currRound + 1}`);
    
    let roundResult = playRound(playerSelection, computerSelection);
    updateGameLog(roundResult);

    if (roundResult.search("Lose") > 0) {
        gameTracker.computerScore += 1;
    } else if (roundResult.search("Win") > 0) {
        gameTracker.playerScore += 1;
    } else {
        gameTracker.draws += 1;
    };

    updatePlayerScore(gameTracker.playerScore);
    updateComputerScore(gameTracker.computerScore);
    updateDraws(gameTracker.draws);
    gameTracker.roundCount +=1;

    if (gameTracker.playerScore == 5 || gameTracker.computerScore == 5) {
        let gameOutcome = (gameTracker.playerScore > gameTracker.computerScore) ? "You Won the Game":
                     (gameTracker.playerScore < gameTracker.computerScore) ? "You Lost the Game": "Draw game"; 
        let gameSummary = `${gameOutcome}! ${gameTracker.playerScore}(You) to ${gameTracker.computerScore}(Computer) with ${gameTracker.draws} draws.`
        updateGameLog(gameSummary);
        updateGameLog("---------------------------------------------------------------");
        clearGameTracker();
        updateGameStatus("Game Over! Play again?");
    };
    updateScroll();
};

function getComputerSelection() {
    let randomNum = Math.floor((Math.random() * 3) + 1);
    let computerSelection = (randomNum === 1) ? "rock":
                            (randomNum === 2) ? "paper": "scissors"; 
    return computerSelection;
};

function playRound (playerSelection, computerSelection) {
    let result = null;
    if (playerSelection === computerSelection) {
        result = `Draw! ${capitalizeFirstLetter(playerSelection)} = ${capitalizeFirstLetter(computerSelection)}`;
        return result; 
    };

    switch (playerSelection) {
        case "rock":
            switch (computerSelection) {
                case "paper":
                    result = "You Lose! Paper beats Rock";
                    break;
                case "scissors":
                    result = "You Win! Rock beats Scissors";
                    break;
            }
        break;
        case "paper":
            switch (computerSelection) {
                case "scissors":
                    result = "You Lose! Scissors beats Paper";
                    break;
                case "rock":
                    result = "You Win! Paper beats Rock";
                    break;
            }
        break;
        case "scissors":
            switch (computerSelection) {
                case "rock":
                    result = "You Lose! Rock beats Scissors";
                    break;
                case "paper":
                    result = "You Win! Scissors beat Paper";
                    break;
            }
        break;
    };
    return result;
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function updateScroll(){
    let element = document.querySelector("#gameOutputs");
    element.scrollTop = element.scrollHeight;
};

function removeScoreTransition(e) {
    e.target.classList.remove('scoreTransition');
  }