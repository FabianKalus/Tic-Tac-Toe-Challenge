


// create a 2D array to represent the game board
let board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
];

// create variables to keep track of the current player and game stats
let currentPlayer = 'X';
let gameWon = false;
let gameDraw = false
let inputCorrect = true;
let fieldFilled = false;
let movesCounter = 0;
let showScore = false;
let xWon = 0;
let oWon = 0;
let endedDraw = 0;

// adds a modul (readline) that allows line by line reading 
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// adds a keylistener
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (key) => {
    // if the key p is pressed the stats are logged in the console and showScore will be true.
    if (key === 'p') {
        showScore = true;
        console.clear();
        console.log(`Stats: X-wins: ${xWon}, O-wins: ${oWon}, draw: ${endedDraw}
Press "Enter" to continue`);
    } 
    // if the key enter is pressed while showScore is true, score whill be hide and the game continue
    else if (key === '\r' && showScore) {
        showScore = false;
        console.clear();
        rl.clearLine(-1);
        playGame();
    } 
    // if the key e is pressed during the game the game will end. 
    else if (key === 'e') {
        process.exit();
    }
});

// print the board based on the variable board in the console
function printBoard() {
    console.log(' ');
    console.log('  ' + board[0][0] + ' | ' + board[0][1] + ' | ' + board[0][2]);
    console.log(' -----------')
    console.log('  ' + board[1][0] + ' | ' + board[1][1] + ' | ' + board[1][2]);
    console.log(' -----------')
    console.log('  ' + board[2][0] + ' | ' + board[2][1] + ' | ' + board[2][2]);
    console.log(' ');
}

// function to check if a player has won the game
function checkWin() {
    for (let i = 0; i < 3; i++) {
        // check for horizontal wins
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== ' ') {
            gameWon = true;
            return;
        };
        // check for vertical wins
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== ' ') {
            gameWon = true;
            return;
        };
    };
    // check for diagonal wins
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== ' ') {
        gameWon = true;
        return;
    };
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== ' ') {
        gameWon = true;
        return;
    };
}

// ask the player if he / she wants to start a new game. the text is a variable because the game can have ended draw and with someone wins
function newGame(text) {
    rl.question(text, () => {
        resetEverything();
        playGame();
    });
}

//check if the game is draw based on the movesCounter
function checkDraw() {
    movesCounter++
    if (movesCounter === 9 && !gameWon) {
        gameDraw = true;
    }
}

//reset everything to start a new game. except the statistics and the currentplayer
function resetEverything() {
    gameWon = false;
    gameDraw = false;
    switchPlayer();
    console.clear();
    movesCounter = 0;
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
}





// start the funktion to play the game. this functions is looped through inner functions until the game is not finished
function playGame() {

    // print an empty board to start with
    if (movesCounter === 0) {
        console.clear();
        printBoard();
    }

    // ask the player in the console at which position she / he will set the mark
    rl.question(currentPlayer + ': ' + 'Please enter the position of your mark (Row:Column):', (input) => {

        if (!showScore) {
            // checks if the entered numbers are correct 
            checkInput(input);

            if (inputCorrect) {
                // take numbers from the input and sub 1 because the arrays starts by 0 and not 1.
                let row = input[0] - 1;
                let col = input[2] - 1;

                //clear the board
                console.clear();

                // update Board
                updateBoard(row, col);

                if (!fieldFilled) {
                    // print game board
                    printBoard();

                    // check for win
                    checkWin();

                    //check for draw
                    checkDraw();

                    // loop the game until it´s finised
                    if (!gameWon && !gameDraw) {

                        // switch player
                        switchPlayer();

                        playGame();
                    } else if (!gameWon && gameDraw) {
                         //update the stats
                        updateStats();

                        // send the message that the game ended in a draw and give the oppurtiunity to start a new round
                        newGame(`The game ended in a draw.
Stats: X-wins: ${xWon}, O-wins: ${oWon}, draw: ${endedDraw}                        
Do you want to start a new game?`);

                    } else {
                         //update the stats
                        updateStats();

                        // send the message who won the game and give the oppurtiunity to start a new round
                        newGame(`${currentPlayer}: Won the game. 
Stats: X-wins: ${xWon}, O-wins: ${oWon}, draw: ${endedDraw}
Do you want to start a new game?`);
                    };
                };
            };
        };
    });
};

// update the stats. Add 1 to oWon, xWon or endeddraw variables
function updateStats() {

    if (gameWon) {
        if (currentPlayer === 'X') {
            xWon++;
        } else {
            oWon++;
        }
    } else if(gameDraw && !gameWon) {
        endedDraw++;
    }
}

// switch players
function switchPlayer() {
    if (currentPlayer === 'X') {
        currentPlayer = 'O';
    }
    else {
        currentPlayer = 'X';
    };
};

function checkInput(input) {

    //checks if string length is correct
    checkInputLength(input);

    if (inputCorrect) {
        //checks if the numbers are correct
        checkInputFormat(input);
    };
};

function checkInputLength(input) {
    if (input.length !== 3) {
        console.clear();
        console.error(`The inserted field is not valid. Try again:
Example: "2:2" places the X in the  middle center field`);
        inputCorrect = false;
        printBoard();
        playGame();
    } else {
        inputCorrect = true;
    };
};

function checkInputFormat(input) {
    // checks the first number of the input if it is 1, 2 or 3. If not, it will return an error and ask the question again
    if (input[0] != 1 && input[0] != 2 && input[0] != 3) {
        console.clear();
        console.error(`The inserted field is not valid. Try again:
Example: "2:2" places the X in the  middle center field`);
        inputCorrect = false;
        printBoard();
        playGame();
    }

    // checks the second number of the input if it is 1, 2 or 3. If not, it will return an error and ask the question again
    else if (input[2] != 1 && input[2] != 2 && input[2] != 3) {
        console.clear();
        console.error(`The inserted field is not valid. Try again:
Example: "2:2" places the X in the  middle center field`);
        inputCorrect = false;
        printBoard();
        playGame();
    }

    // add later when testing is finished
    // else if (input[1] != ':') {
        // console.clear();
    //       console.error(`The inserted field is not valid. Try again:
     //    Example: "2:2" places the X in the  middle center field`);
    //     inputCorrect = false;
    //     printBoard();
    //     playGame();
    // }

    // set input correct so the rl.question can continue.
    else {
        inputCorrect = true;
    };
};

// update the board and checks if the field is already taken. If it´s taken the player has to try it again. 
function updateBoard(row, col) {
    if (board[row][col] != ' ') {
        console.clear();
        console.error('The inserted field is already taken. Try again:');
        fieldFilled = true;
        printBoard();
        playGame();
    }
    else {
        fieldFilled = false;
        board[row][col] = currentPlayer;
    };
};


// starts the game at the beginning
playGame();




