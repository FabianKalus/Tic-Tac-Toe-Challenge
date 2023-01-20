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
let inputCounter = 0;
let showScore = false;
let showRules = false;
let xWon = 0;
let oWon = 0;
let endedDraw = 0;
let gameVSComputer = false;
let computerDidTurn = false;
let rules = `We play the game with the official rules and no modifications:
- X places its mark first in the first round
- The looser of the last game starts the game, which is then
- played in an endless alternating order
- Players must mark its position within the nine spaces
- The first player to get 3 of her marks in a row (up, down,
- across, or diagonally) is the winner
- When all 9 squares are full, the game is over. If no player has 3
- marks in a row, the game ends in a tie. X starts the next game

Keycode:
"r" = show rules
"p" = show stats
"e" = end the game`;

// adds a modul (readline) that allows line by line reading 
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// starts the game at the beginning
chooseOpponent();

// ask the player if he wants to play a computer or a human. Loop the question if the answer is not c or h
function chooseOpponent(){
    rl.question('You want to play against a computer (c) or a human (h):', (input) => {
        if(input === 'c'){
            gameVSComputer = true;
            playVsComputer();
        }
        else if(input === 'h'){
            gameVSComputer = false;
            playVsComputer();
        } else {
            console.clear();
            console.log('The input wasn´t correct. Try again.');
            chooseOpponent();          
        };   
    });
};

// start the funktion to play the game. this functions is looped through inner functions until the game is not finished
function playGame() {

    // before the first round it will be explained where to find the rules and print an empty board
    firstRound();

    if (currentPlayer === 'O' && gameVSComputer === true) {
        playVsComputer();
    } else {

        // ask the player in the console at which position she / he will set the mark
        rl.question(currentPlayer + ': ' + 'Please enter the position of your mark (Row:Column):', (input) => {

            if (!showScore) {
                // checks if the entered numbers are correct 
                checkInput(input);

                if (inputCorrect) {
                    // take numbers from the input and sub 1 because the arrays starts by 0 and not 1.
                    let row = input[0] - 1;
                    let col = input[2] - 1;

                    // update Board
                    updateBoard(row, col);

                    if (!fieldFilled) {
                        // print game board
                        printBoard();

                        // checks for win and draw
                        checkWinAndDraw();

                        // loop the game until it´s finised
                        gameLoop();
                    };
                };
            };
        });
    };
};

// before the first round it will be explained where to find the rules and print an empty board.
// inputCounter if the player makes a wrong input in the first round
function firstRound() {
    if (movesCounter === 0 && inputCounter === 0) {
        console.clear();
        console.log(`If you want to look up the rules, you can press "r" during the game to show them.`);
        inputCounter++
        printBoard();
    };
};

// print the board based on the variable board in the console
function printBoard() {
    console.log(' ');
    console.log('  ' + board[0][0] + ' | ' + board[0][1] + ' | ' + board[0][2]);
    console.log(' -----------');
    console.log('  ' + board[1][0] + ' | ' + board[1][1] + ' | ' + board[1][2]);
    console.log(' -----------');
    console.log('  ' + board[2][0] + ' | ' + board[2][1] + ' | ' + board[2][2]);
    console.log(' ');
};

// check the input from rl.question, where player wants to set a mark
function checkInput(input) {

    //checks if string length is correct
    checkInputLength(input);

    if (inputCorrect) {
        //checks if the numbers are correct. If input.length is correct to avoid double error messages
        checkInputFormat(input);
    };
};

//checks if string length is correct
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

//checks if the numbers are correct. If input.length is correct to avoid double error messages
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
    // checks if there is a : between the numbers
    else if (input[1] != ':') {
        console.clear();
        console.error(`The inserted field is not valid. Try again:
Example: "2:2" places the X in the  middle center field`);
        inputCorrect = false;
        printBoard();
        playGame();
    }
    // set input correct so the rl.question can continue.
    else {
        inputCorrect = true;
    };
};

function checkWinAndDraw() {
    // check for win
    checkWin();
    //check for draw
    checkDraw();
};



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
};

//check if the game is draw based on the movesCounter
function checkDraw() {
    movesCounter++
    if (movesCounter === 9 && !gameWon) {
        gameDraw = true;
    };
};

// update the board and checks if the field is already taken. If it´s taken the player has to try it again. 
function updateBoard(row, col) {
    console.clear();
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

// loop the game until it´s finised
function gameLoop() {
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
Do you want to start a new game (Press "Enter")? `);

    } else {
        //update the stats
        updateStats();
        // send the message who won the game and give the oppurtiunity to start a new round
        newGame(`${currentPlayer}: Won the game. 
Stats: X-wins: ${xWon}, O-wins: ${oWon}, draw: ${endedDraw}
Do you want to start a new game? (Press "Enter")`);
    };
};

// switch players
function switchPlayer() {
    if (currentPlayer === 'X') {
        currentPlayer = 'O';
    }
    else {
        currentPlayer = 'X';
    };
};

// update the stats. Add 1 to oWon, xWon or endeddraw variables
function updateStats() {
    if (gameWon) {
        if (currentPlayer === 'X') {
            xWon++;
        } else {
            oWon++;
        }
    } else if (gameDraw && !gameWon) {
        endedDraw++;
    };
};

// ask the player if he / she wants to start a new game. the text is a variable because the game can have ended draw and with someone wins
function newGame(text) {
    rl.question(text, () => {
        resetEverything();
        playGame();
    });
};

//reset everything to start a new game. except the statistics and the currentplayer
function resetEverything() {
    gameWon = false;
    gameDraw = false;
    switchPlayer();
    console.clear();
    movesCounter = 0;
    inputCounter = 0;
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
};

// adds a keylistener
readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);
process.stdin.on('keypress', (key) => {
    // if the key p is pressed the stats are logged in the console and showScore will be true.
    if (key === 'p') {
        showScore = true;
        console.clear();
        console.log(`Stats: X-wins: ${xWon}, O-wins: ${oWon}, draw: ${endedDraw}
Press "Enter" to continue`);
    }
    // if the key enter is pressed while showScore is true, score will be hide and the game continue
    else if (key === '\r' && showScore) {
        showScore = false;
        console.clear();
        rl.clearLine(-1);
        printBoard();
        playGame();
    }
    // if the key r is pressed the rules are logged in the console and showRules will be true.
    if (key === 'r') {
        showScore = true;
        console.clear();
        console.log(`${rules}

Press "Enter" to continue`);
    }
    // if the key enter is pressed while showRules is true, rules will be hide and the game continue
    else if (key === '\r' && showRules) {
        showRules = false;
        console.clear();
        rl.clearLine(-1);
        printBoard();
        playGame();
    }
    // if the key e is pressed during the game the game will end. 
    else if (key === 'e') {
        process.exit();
    }
});


// User Storie 6, play vs a computer 

function playVsComputer() {
    gameVSComputer = true;
    if (currentPlayer === 'X') {
        playGame();
    }
    else {
        // update Board
        computerDidTurn = false;

        // computerWinandLose checks for O if the computer has an possibilty to win
        computerWinandLose('O');
        if (!computerDidTurn) {
             // computerWinandLose checks for X if the player has an possibilty to win
            computerWinandLose('X');
        }
        if (!computerDidTurn) {
            // create random coordinats and upload them to the board. If the field is already marked, the function is looped until it find an unmarked field. 
           creatRandomCoordinats();
        };

        if (!fieldFilled) {
            // print game board
            printBoard();

            // checks for win and draw
            checkWinAndDraw();

            // loop the game until it´s finised
            gameLoop();
        };
    };
};

//  create random coordinats and upload them to the board. If the field is already marked, the function is looped until it find an unmarked field. 
function creatRandomCoordinats() { 
    let coordinatRow = Math.floor(Math.random() * 3);
    let coordinatColumn = Math.floor(Math.random() * 3);

    if (board[coordinatRow][coordinatColumn] !== ' ') {
        creatRandomCoordinats();
    } else {
        updateBoard(coordinatRow, coordinatColumn);
    };
};

// function check computerWin, the variable player is used for X and O.
function computerWinandLose(player) {
    for (let i = 0; i < 3; i++) {
        // check for horizontal wins
        checkHorizontal(i, player);
        // check for vertical wins
       checkVertical(i, player);
    };
    // check for diagonal wins
    checkDiagonal(player);
};

 // check for horizontal wins
function checkHorizontal(i, player){
    if (board[i][0] === player && board[i][2] === player && board[i][1] === ' ' && !computerDidTurn) {
        updateBoard(i, 1);
        computerDidTurn = true;
        return;
    };
    if (board[i][0] === player && board[i][1] === player && board[i][2] === ' ' && !computerDidTurn) {
        updateBoard(i, 2)
        computerDidTurn = true;
        return;
    };
    if (board[i][1] === player && board[i][2] === player && board[i][0] === ' ' && !computerDidTurn) {
        updateBoard(i, 0)
        computerDidTurn = true;
        return;
    };
};

  // check for vertical wins
function checkVertical(i, player){
    if (board[0][i] === player && board[2][i] === player && board[1][i] === ' ' && !computerDidTurn) {
        updateBoard(1, i)
        computerDidTurn = true;
        return;
    };
    if (board[0][i] === player && board[1][i] === player && board[2][i] === ' ' && !computerDidTurn) {
        updateBoard(2, i)
        computerDidTurn = true;
        return;
    };
    if (board[1][i] === player && board[2][i] === player && board[0][i] === ' ' && !computerDidTurn) {
        updateBoard(0, i)
        computerDidTurn = true;
        return;
    };
}

 // check for diagonal wins
function checkDiagonal(player){
    if (board[0][0] === player && board[1][1] === player && board[2][2] === ' ' && !computerDidTurn) {
        updateBoard(2, 2)
        computerDidTurn = true;
        return;
    };
    if (board[0][0] === player && board[2][2] === player && board[1][1] === ' ' && !computerDidTurn) {
        updateBoard(1, 1)
        computerDidTurn = true;
        return;
    };
    if (board[1][1] === player && board[2][2] === player && board[0][0] === ' ' && !computerDidTurn) {
        updateBoard(0, 0)
        computerDidTurn = true;
        return;
    };
    if (board[0][2] === player && board[2][0] === player && board[1][1] === ' ' && !computerDidTurn) {
        updateBoard(1, 1)
        computerDidTurn = true;
        return;
    };
    if (board[1][1] === player && board[2][0] === player && board[0][2] === ' ' && !computerDidTurn) {
        updateBoard(0, 2)
        computerDidTurn = true;
        return;
    };
    if (board[1][1] === player && board[0][2] === player && board[2][0] === ' ' && !computerDidTurn) {
        updateBoard(2, 0)
        computerDidTurn = true;
        return;
    };
};






