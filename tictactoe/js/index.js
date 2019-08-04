window.addEventListener("DOMContentLoaded", function () {

   const winningConfs = [
      [1, 5, 9],
      [3, 5, 7],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
   ];

   let GameBoard = [[], [], []];

   let DemoGameBoard = [[
       0, undefined, 1
   ],[
       undefined, 0, 1
   ],[
       1, undefined, 0
   ]];

   const GameStartGameBoard = [[],[],[]];

   /**
    * @return {Nubmer|undefined}   0=we, 1=computer
    * @param {GameBoard} gameBoard
    */
   function getWinner(gameBoard) {
      // Get winning confgs mask over the current game board state
      const mask = [];
      winningConfs.forEach(function(winningConf) {
         const maskPart = [];

         winningConf.forEach(function(num) {
            maskPart.push(gameBoard[numToCoor(num)[0]][numToCoor(num)[1]]);
         });

         mask.push(maskPart);
      });

      let WINNER_ENUM = undefined;

      // Check whether there is a mask that contains only one single player
      mask.forEach(function(mask) {
         if(mask.indexOf(0) !== -1 && mask.indexOf(1) === -1 && mask.indexOf(undefined) === -1) {
            WINNER_ENUM = 0;
         } else if(mask.indexOf(0) === -1 && mask.indexOf(1) !== -1 && mask.indexOf(undefined) === -1) {
            WINNER_ENUM = 1;
         }
      });

      return WINNER_ENUM;
   }

   function resetGameBoard() {
      // Redraw game board
      for(let i=1; i<10; i++) {
         const button = document.getElementById(i);
         button.removeAttribute("class");
         button.removeAttribute("disabled");
         button.innerHTML = "";

         document.querySelector(".lose-message").style.display = "none";
         document.querySelector(".win-message").style.display = "none";
         document.querySelector(".draw-message").style.display = "none";
      }

      GameBoard = [[],[],[]];

      drawGameBoard(GameBoard);
   }

   function numToCoor(num) {
      return [Math.floor(num/3.1), num-3*Math.floor(num/3.1)-1];
   }

   /**
    *
    * @return GameBoard
    * @param {GameBoard} gameBoard
    */
   function doComputerMakeMove(gameBoard) {
      // Find all available moves
      const availMoves = getAvailableMoves(gameBoard);

      if(availMoves.length === 0) {
         return;
      }

      // Choose one randomly
      const computerMove = availMoves[getRand(0, availMoves.length-1)];

      // Redraw game board
      gameBoard[computerMove[0]][computerMove[1]] = 1;

      document.getElementById(3*computerMove[0]+computerMove[1]+1).setAttribute("class", "computer");
   }

   function getRand(min, max) {
      return Math.max(min, (Math.round(Math.random()*10))%(max+1));
   }

   /**
    * @return undefined
    * @param gameBoard
    */
   function drawGameBoard(gameBoard) {
      // Redraw game board
      for(let i=1; i<10; i++) {
         const gameBoardValueAtPosition = gameBoard[numToCoor(i)[0]][numToCoor(i)[1]];
         const button = document.getElementById(i);

          if(gameBoardValueAtPosition === 0) {
             button.innerHTML = "😃";
          } else if(gameBoardValueAtPosition === 1) {
             button.innerHTML = "💻";
          }

         if(gameBoardValueAtPosition !== undefined) {
            button.setAttribute("disabled", "");
         }
      }

      // Set visibility of the restart button
      if(getAvailableMoves(GameBoard).length === 0
          || (getWinner(GameBoard) === undefined && getAvailableMoves(GameBoard).length === 0)
          || (getWinner(GameBoard) !== undefined)) {
         document.getElementById("play").style.visibility = "visible";
      } else if(getAvailableMoves(GameBoard).length > 0 && getWinner(GameBoard) === undefined) {
         document.getElementById("play").style.visibility = "hidden";
      }

      // Set visibility of a winner message
      if(getWinner(GameBoard) === 0) {
         document.querySelector('.message.win-message').style.display = "block";
      } else if(getWinner(GameBoard) === 1) {
         document.querySelector('.message.lose-message').style.display = "block";
      } else if(getAvailableMoves(GameBoard).length === 0) {
         document.querySelector('.message.draw-message').style.display = "block";
      }
   }

   function getAvailableMoves(gameBoard) {
      const availMoves = [];

      for(let i=0; i<3; i++) {
         for(let j=0; j<3; j++) {
            if(gameBoard[i][j] === undefined) {
               availMoves.push([i, j]);
            }
         }
      }

      return availMoves;
   }

   /**
    * Player move event listeners
    */
   for(let i=1; i<10; i++) {
      const button = document.getElementById(i);
      button.addEventListener("click", function() {

         if(getWinner(GameBoard) !== undefined) {
            return;
         }

         GameBoard[numToCoor(i)[0]][numToCoor(i)[1]] = 0;
         button.setAttribute("class", "player");
         drawGameBoard(GameBoard);

         // Let the computer make a move only if there is no winner
         if(getWinner(GameBoard) === undefined) {
            doComputerMakeMove(GameBoard);
            drawGameBoard(GameBoard);
         }
      });
   }

   // Draw the first game board automatically
   window.resetGame = resetGameBoard;

   drawGameBoard(GameBoard);
});