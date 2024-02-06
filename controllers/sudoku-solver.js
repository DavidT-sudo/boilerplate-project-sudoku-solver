class SudokuSolver {


    validate(puzzleString) {

        if(!puzzleString) {
            return "Required field missing";
        }

        if(puzzleString.length != 81) {
            return "Expected puzzle to be 81 characters long";
        }

        if(/[^1-9.]/g.test(puzzleString)) {
            return "Invalid characters in puzzle";
        }

        return "Valid";
    }

    checkRowPlacement(board, row, value) { 
        if(!Array.isArray(board)) {
            let board = this.transformTogrid(board);
        }
        
        for(var i = 0; i < board[row].length; i++) {
            if(board[row][i] === value) {
                return false;
            }
        }
       
        return true;
    }

    checkColPlacement(board, column, value) {
        if(!Array.isArray(board)) {
            let board = this.transformTogrid(board);
        }

        for(var i = 0; i < board.length; i++) {
            if(board[i][column] === value) {
                return false;
            }
        }
    
        return true;
    }

    checkSquarePlacement(board, row, column, value) {
        if(!Array.isArray(board)) {
            let board = this.transformTogrid(board);
        }

        boxRow = Math.floor(row / 3) * 3;
        boxCol = Math.floor(column / 3) * 3;
    
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                if (board[boxRow + r][boxCol + c] === value) 
                    return false;
            }
        }

        return true;
    }

    transformTogrid(puzzleString) {
        
        const grid = [];
        
        for (i = 1; i < 10 ; i++) {
            grid.push([]);

            for(j = 1; j < 10; j++) {
                let puzzleStringIndex = (i * 9) + j;

                if(puzzleString[puzzleStringIndex] == ".") {
                    grid[i][j] = 0;
                } else {
                    grid[i][j] = Number(puzzelString[puzzleStringIndex]);
                }
            }
        };
        
        return grid;
    }

    solve(board) {
        // find Empty cell to fill
        function nextEmptySpot(board) {
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (board[i][j] === 0) 
                        return [i, j];
                }
            }
            return [-1, -1];
        }

        // check if value passes all checks
        function checkValue(board, row, column, value) {


            if(checkRow(board, row, value) &&
              checkColumn(board, column, value) &&
              checkSquare(board, row, column, value)) {
                return true;
            }
            
            return false; 
        };

          
        let emptySpot = nextEmptySpot(board);
        let row = emptySpot[0];
        let col = emptySpot[1];
    
        // there is no more empty spots
        if (row === -1){
            console.log("there is no empty spots");
            return board;
        }
    
        for(let num = 1; num<=9; num++){
            if (checkValue(board, row, col, num)){
                board[row][col] = num;
                solve(board);
            }
        }
    
        if (nextEmptySpot(board)[0] !== -1)
            board[row][col] = 0;
    

        return board;

    }
}

module.exports = SudokuSolver;

