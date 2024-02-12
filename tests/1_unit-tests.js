const chai = require('chai');
const assert = chai.assert;
const puzzleStrings = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('Unit Tests', () => {
    
    //test 1
    test('Logic handles a valid puzzle string of 81 characters', (done) => {
        assert.equal(solver.validate(puzzleStrings[0][0]), "Valid");
        done();

    });

    //test 2
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
        let invalidStr = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a';

        assert.equal(solver.validate(invalidStr), "Invalid characters in puzzle");
        done();
    });

    //test 3
    test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
        let invalidStr = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.33';

        assert.equal(solver.validate(invalidStr), "Expected puzzle to be 81 characters long");
        done();
    });

    //test 4
    test('Logic handles a valid row placement', (done) => {
        let puzzleString = puzzleStrings[0][0];
        let row = 0;
        let value = 9;

        assert.equal(solver.checkRowPlacement(puzzleString, row, value), true);
        done();
    });

    //test 5
    test('Logic handles an invalid row placement', (done) => {
        let puzzleString = puzzleStrings[0][0];
        let row = 0;
        let value = 0;

        assert.equal(solver.checkRowPlacement(puzzleString, row, value), false);
        done();
    });

    //test 6
    test('Logic handles a valid column placement', (done) => {
        let puzzleString = puzzleStrings[0][0];
        let col = 0;
        let value = 9;

        assert.equal(solver.checkColPlacement(puzzleString, col, value), true );
        done();
    });

    //test 7
    test('Logic handles an invalid column placement', (done) => {
        let puzzleString = puzzleStrings[0][0];
        let col = 0;
        let value = 1;

        assert.equal(solver.checkColPlacement(puzzleString, col, value), false);
        done();
    });

    //test 8
    test('Logic handles a valid region (3x3 grid) placement', (done) => {
        let puzzleString = puzzleStrings[0][0];
        let row = 1;
        let col = 0;
        let value = 9;

        assert.equal(solver.checkSquarePlacement(puzzleString, row, col, value), true);
        done();
    })

    //test 9
    test('Logic handles an invalid region (3x3 grid) placement', (done) => {
        let puzzleString = puzzleStrings[0][0];
        let row = 1;
        let col = 0;
        let value = 1;

        assert.equal(solver.checkSquarePlacement(puzzleString, row, col, value), false);
        done();
    });

    //test 10
    test('Valid puzzle strings pass the solver', (done) => {
        let puzzleString = puzzleStrings[0][0];
        let result = solver.solve(puzzleString);
        
        assert.isArray(result);
        assert.equal(result.flat().join(""), puzzleStrings[0][1]);
        done();
    });

    //test 11
    test('Invalid puzzle strings fail the solver', (done) => {
        let invalidStr = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.33";
        let result = solver.solve(invalidStr);

        assert.isNotArray(result);
        done();
    });

    //test 12
    test('Solver returns the expected solution for an incomplete puzzle', (done) => {
        let puzzleString1 = puzzleStrings[1][0];
        let puzzleString2 = puzzleStrings[3][0];
        let puzzleString3 = puzzleStrings[4][0];

        let solution1 = puzzleStrings[1][1];
        let solution2 = puzzleStrings[3][1];
        let solution3 = puzzleStrings[4][1];

        let result1 = solver.solve(puzzleString1).flat().join("");
        let result2 = solver.solve(puzzleString2).flat().join("");
        let result3 = solver.solve(puzzleString3).flat().join("");

        assert.equal(solution1, result1);
        assert.equal(solution2, result2);
        assert.equal(solution3, result3);
        done();
    });

});
