import { it, expect } from 'vitest';
import { readlineSync } from 'readline-sync';


import {
    checkInputLength, inputCorrect, checkInputFormat, checkWin, checkDraw, updateBoard, resetEverything, switchPlayer, updateStats,
    gameWon, board, gameDraw, currentPlayer, fieldFilled, oWon, xWon, endedDraw, rl, newGame, printBoard
} from './tic_tac_toe';





const assert = require('assert');
const sinon = require('sinon');

// user storie 1

describe('printBoard', () => {
    it('should print the board correctly', () => {
        // Act
        // Capture the console output using a spy
        const spy = sinon.spy(console, 'log');
        printBoard();

        // Assert
        expect(spy.getCall(0).args[0]).toBe(' ');
        expect(spy.getCall(1).args[0]).toBe('    |   |  ');
        expect(spy.getCall(2).args[0]).toBe(' -----------');
        expect(spy.getCall(3).args[0]).toBe('    |   |  ');
        expect(spy.getCall(4).args[0]).toBe(' -----------');
        expect(spy.getCall(5).args[0]).toBe('    |   |  ');
        expect(spy.getCall(6).args[0]).toBe(' ');
        spy.restore();
    });
});


// user storie 2

describe('printBoard', () => {
    it('should print the board correctly', () => {
        // Act
        // Capture the console output using a spy
        const spy = sinon.spy(console, 'log');
        updateBoard(1, 1);
        printBoard();

        // Assert
        expect(spy.getCall(0).args[0]).toBe(' ');
        expect(spy.getCall(1).args[0]).toBe('    |   |  ');
        expect(spy.getCall(2).args[0]).toBe(' -----------');
        expect(spy.getCall(3).args[0]).toBe('    | X |  ');
        expect(spy.getCall(4).args[0]).toBe(' -----------');
        expect(spy.getCall(5).args[0]).toBe('    |   |  ');
        expect(spy.getCall(6).args[0]).toBe(' ');
        spy.restore();
    });
});

describe("updateBoard", () => {
    beforeEach(() => {
        resetEverything();
    });
    afterEach(() => {
        resetEverything();
    });
    it("should set fieldFilled to true", () => {
        //Act
        for (let i = 0; i < 2; i++) {
            updateBoard(0, 0);
        };

        //Assert
        expect(fieldFilled).toBe(true);
    });

    it("should update the board to X and set fieldFilled to false if the field is not already taken", () => {
        //Act
        switchPlayer();
        updateBoard(0, 0);

        //Assert
        expect(board[0][0]).toBe("X");
        expect(fieldFilled).toBe(false);
    });
});

describe('checkInputLength', () => {
    it('should return inputCorrect false when input length is not equal to 3', () => {
        // Arrange
        const input = "22";

        // Act
        checkInputLength(input);

        // Assert
        expect(inputCorrect).toBe(false);
    });
    it('should return inputCorrect true when input length is not equal to 3', () => {
        // Arrange
        const input = "222";

        // Act
        checkInputLength(input);

        // Assert
        expect(inputCorrect).toBe(true);
    });
});

describe('checkInputFormat', () => {
    it('should return inputCorrect false when input the first number is not one of the numbers 1, 2, 3', () => {
        // Arrange
        const input = "4:2";

        // Act
        checkInputFormat(input);

        // Assert
        expect(inputCorrect).toBe(false);
    });
    it('should return inputCorrect true when input the first number is not one of the numbers 1, 2, 3', () => {
        // Arrange
        const input = "1:2";
        const input2 = "2:2";
        const input3 = "3:2";

        // Act
        checkInputFormat(input);
        checkInputFormat(input2);
        checkInputFormat(input3);

        // Assert
        expect(inputCorrect).toBe(true);
    });
    it('should return inputCorrect false when input the third number is not one of the numbers 1, 2, 3', () => {
        // Arrange
        const input = "2:4";

        // Act
        checkInputFormat(input);

        // Assert
        expect(inputCorrect).toBe(false);
    });
    it('should return inputCorrect true when input the third number is not one of the numbers 1, 2, 3', () => {
        // Arrange
        const input = "1:1";
        const input2 = "2:2";
        const input3 = "3:3";

        // Act
        checkInputFormat(input);
        checkInputFormat(input2);
        checkInputFormat(input3);

        // Assert
        expect(inputCorrect).toBe(true);
    });
    it('should return inputCorrect false when there is not a : between the numbers in the input', () => {
        // Arrange
        const input = "224";

        // Act
        checkInputFormat(input);

        // Assert
        expect(inputCorrect).toBe(false);
    });
    it('should return inputCorrect false when there is not a : between the numbers in the input', () => {
        // Arrange
        const input = "2:4";

        // Act
        checkInputFormat(input);

        // Assert
        expect(inputCorrect).toBe(false);
    });
});

// user storie 3

describe('switchPlayer', () => {
    it('should switch currentPlayer from X to O', () => {
        
        expect(currentPlayer).toBe('O');
    });

    it('should switch currentPlayer from O to X', () => {
        switchPlayer();
        expect(currentPlayer).toBe('X');
    });
});

describe('checkWin', () => {
    it('should detect horizontal win', () => {
        board[0] = ['X', 'X', 'X'];
        checkWin();
        expect(gameWon).toBe(true);
    });

    it('should detect vertical win', () => {
        for (let i = 0; i < 3; i++) {
            board[i][0] = 'O';
        }
        checkWin();
        expect(gameWon).toBe(true);
    });

    it('should detect diagonal win (top-left to bottom-right)', () => {
        for (let i = 0; i < 3; i++) {
            board[i][i] = 'X';
        }
        checkWin();
        expect(gameWon).toBe(true);
    });

    it('should detect diagonal win (top-right to bottom-left)', () => {
        for (let i = 0; i < 3; i++) {
            board[i][2 - i] = 'O';
        }
        checkWin();
        expect(gameWon).toBe(true);
    });
});

describe('checkDraw', () => {
    it('should not set gameDraw to true if movesCounter is less than 9', () => {
        // Act
        checkDraw();

        // Assert
        expect(gameDraw).toBe(false);
    });

    it('should set gameDraw to true if movesCounter is 9 and gameWon is false', () => {
        // Act
        resetEverything();
        for (let i = 0; i < 9; i++) {
            checkDraw();
        };

        // Assert
        expect(gameDraw).toBe(true);
    });
});

describe('newGame', () => {
    it('should call rl.question with the correct text', () => {
        //Act
        const expectedText = 'Are you ready to start a new game?';
        const spy = sinon.spy(rl, 'question');

        // Assert
        newGame(expectedText);

        // Act
        assert.ok(spy.calledWith(expectedText))
    });
});

// user storie 4

describe('updateStats', () => {
    it('should increment xWon and oWon to be 1, because every player wins one round', () => {
        // Act
        for(let i = 0; i < 2; i++) {
            updateBoard(0, 0);
            switchPlayer();
            updateBoard(0, 1);
            switchPlayer();
            updateBoard(1, 1);
            switchPlayer();
            updateBoard(0, 2);
            switchPlayer();
            updateBoard(2, 2);
            checkWin();
            updateStats();
            resetEverything();
        };

        // Assert
        expect(xWon).toBe(1);
        expect(oWon).toBe(1);
    });
    it('should increment endedDraw by 1, because the movecounter > 8', () => {
        // Act
            for (let i = 0; i < 9; i++) {
                checkDraw();
            };
            updateStats();

        // Assert
        expect(endedDraw).toBe(1);
    })
});
