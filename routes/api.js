'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
        console.log(req.body);
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
            console.log("solutionStr.... ",solutionStr);
            res.json({solution: solutionStr});

        }


    });
};
