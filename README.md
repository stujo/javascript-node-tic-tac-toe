# Stujo's Tic Tac Toe

Is it possible to create an unbeatable Tic Tac Toe agent which doesn't enumerate all the cases?

I'm sure it is, and this is my attempt


* There are two ways to play with this code
  * [Just the Agent](#just-the-agent) (as a node module dependency)
  * [Using the whole App](#using-the-whole-app)  

## Just the Agent

```
$ mkdir ttt-client
$ cd ttt-client
$ npm init 
# Complete the init
```

Install the `tictactoe-agent`
```
$ npm install tictactoe-agent --save
```

Add: index.js
```
var TicTacToe = require('tictactoe-agent');

var model = new TicTacToe.Model('---------', 'X');

console.log(model.boardSummary().recommendation.index);

// Will Print out the recommended move
```

## Using the Whole App


It's a command line ``node.js`` application which takes the game state and current player 'X' or 'O' as parameters as follows:

```
$ node index.js ----X---- O
#####
#   #
# X #
#   #
#####
**************************************
Recommendation for O is 8 (-4)
**************************************
```

The board state is provided as a string with hyphens denoting empty spots, and X or O marking the take spots

The spots on the board are numbered as follows:
```
#####
#012#
#345#
#678#
#####
```

The optional fourth parameter ``debug`` prints out debugging info:

```
$ node index.js ----X---- O debug
#####
#   #
# X #
#   #
#####
**************************************
* Lines ******************************
**************************************
{ line: '   ', mine: 0, thiers: 0, score: 0 }
{ line: ' X ', mine: 0, thiers: 1, score: -2 }
{ line: '   ', mine: 0, thiers: 0, score: 0 }
{ line: '   ', mine: 0, thiers: 0, score: 0 }
{ line: ' X ', mine: 0, thiers: 1, score: -2 }
{ line: '   ', mine: 0, thiers: 0, score: 0 }
{ line: ' X ', mine: 0, thiers: 1, score: -2 }
{ line: ' X ', mine: 0, thiers: 1, score: -2 }
**************************************
Current Score:-8
**************************************
* Options ****************************
**************************************
{ index: 0, spot: ' ', score: -4 }
{ index: 1, spot: ' ', score: -5 }
{ index: 2, spot: ' ', score: -4 }
{ index: 3, spot: ' ', score: -5 }
{ index: 5, spot: ' ', score: -5 }
{ index: 6, spot: ' ', score: -4 }
{ index: 7, spot: ' ', score: -5 }
{ index: 8, spot: ' ', score: -4 }
**************************************
Recommendation for O is 8 (-4)
**************************************
```
