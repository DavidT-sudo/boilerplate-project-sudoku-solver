'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
        console.log(req.body);
        let {coordinate, value} = req.body;
        let puzzleString = req.body.puzzle;

        if(!coordinate || !value ) {
            res.json({error: "Required field(s) missing"});
            return;
        }
        

        let row = coordinate.split("")[0];
        let col = coordinate.split("")[1];

        if(coordinate.length !== 2 || /[^a-i]/i.test(row) || /[^1-9]/i.test(col) ) {
            console.log("coordinate.length....", coordinate.length, "row.....", row, "column.....", col);
            console.log("invalid coordinate");
            res.json({error: "Invalid coordinate"})
            return;
        }

        let validateResult = solver.validate(puzzleString);

        console.log("validateResult........... ", validateResult);
        if(validateResult !== "Valid") {
            res.json({error: validateResult});
            return;
        }

        if(/[^1-9]/.test(value)) {
            res.json({error: "Invalid value"});
            return;
        }

        let board = solver.transformTogrid(puzzleString);

        // change row and column to zero-indexing
        let objMap = {
            "a": 0,
            "b": 1,
            "c": 2,
            "d": 3,
            "e": 4,
            "f": 5,
            "g": 6,
            "h": 7,
            "i": 8
        };

        let zRow = objMap[row.toLowerCase()];
        let zCol = col - 1;

        console.log(`coordinate in zero-index (${zRow}, ${zCol})`);

        let rowIsValid = solver.checkRowPlacement(board, zRow, value);
        let colIsValid = solver.checkColPlacement(board, zCol, value);
        let regionIsValid = solver.checkSquarePlacement(board, zRow, zCol, value);
        let conflict = [];

        if(rowIsValid && colIsValid && regionIsValid) {
            console.log(".....", rowIsValid, colIsValid, regionIsValid, "......");
            res.json({valid: true});
            return;
        }

        if(!rowIsValid) {
            conflict.push("row");
        }

        if(!colIsValid) {
            conflict.push("column");
        }

        if(!regionIsValid) {
            conflict.push("region");
        }

        res.json({valid: false, conflict});

    });
    
  app.route('/api/solve')
    .post((req, res) => {
        let puzzleString = req.body.puzzle;
        let solution = solver.solve(puzzleString);

        if(!Array.isArray(solution)) {
            console.log("puzzle could not be solved");
            console.log(solution);
            res.json({error: "Puzzle could not be solved"});

        } else {
            let solutionStr = solution.flat().join("");
            res.json({solution: solutionStr});

        }


    });
};
