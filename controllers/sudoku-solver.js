class SudokuSolver {
    constructor() {
        let board;
    }


    validate(puzzleString) {

        if(!puzzleString) {
            console.log("validate sees puzzleString as..... ", puzzleString);
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

        let boxRow = Math.floor(row / 3) * 3;
        let boxCol = Math.floor(column / 3) * 3;
    
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
        
        for (let i = 0; i < 9 ; i++) {
            grid.push([]);

            for(let j = 0; j < 9; j++) {
                let puzzleStringIndex = (i * 9) + j;

                if(puzzleString[puzzleStringIndex] == ".") {
                    grid[i][j] = 0;
                } else {
                    grid[i][j] = Number(puzzleString[puzzleStringIndex]);
                }
            }
        };
        
        return grid;
    }

    // check if value passes all checks
    checkValue(board, row, column, value) {
        if(this.checkRowPlacement(board, row, value) &&
          this.checkColPlacement(board, column, value) &&
          this.checkSquarePlacement(board, row, column, value)) {
            return true;
        }
        
        return false; 
    }

    solve(puzzleString) {
        
        //for the first time in the recursion
        if (!Array.isArray(puzzleString)) {
            if (this.validate(puzzleString) !== "Valid") {
                return this.validate(puzzleString);
            }

            let board = this.board = this.transformTogrid(puzzleString);
        }

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

        let emptySpot = nextEmptySpot(this.board);
        let row = emptySpot[0];
        let col = emptySpot[1];
        
        // there is no more empty spots
        if (row === -1){
            console.log("there is no empty spots");
            return this.board;
        }
    
        for(let num = 1; num<=9; num++) {
            console.log("try.............  ", num);
            if (this.checkValue(this.board, row, col, num)) {
                this.board[row][col] = num;
                console.log(`fill coordinates (${row}, ${col}) with ${num}`);
                this.solve(this.board);
                
                console.log("finished recursion");
            }
        }
    
        if (nextEmptySpot(this.board)[0] !== -1)
            this.board[row][col] = 0;
    
        

        return this.board;

    }
}

module.exports = SudokuSolver;

