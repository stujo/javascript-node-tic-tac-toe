# Stujo's Tic Tac Toe

Is it possible to create an unbeatable Tic Tac Toe agent which doesn't enumerate all the cases?

I'm sure it is, and this is my attempt

* There are three ways to play with this code
  * [Just the Agent](#just-the-agent) (as a node module dependency)
  * [Using the whole App](#using-the-whole-app)  
  * [Via the deployed API](#via-the-deployed-api)

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

var recommendation = model.getRecommendation();

console.log(recommendation.index);

// Will Print out the recommended move
```

## Using the Whole App


``tictactoe`` is a command line ``node.js`` application which takes the game state and current player 'X' or 'O' as parameters as follows:

```
$ git clone git@github.com:stujo/javascript-node-tic-tac-toe.git
$ cd javascript-node-tic-tac-toe
$ ./tictactoe --------- x
********************************************************
#####
#   #
#   #
#   #
#####
********************************************************
* Recommendation for X is 2 (Score: 3)
********************************************************
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
$ ./tictactoe --------- x debug
********************************************************
#####
#   #
#   #
#   #
#####
********************************************************
* Lines
********************************************************
{"line":"---","mine":0,"thiers":0,"score":0}
{"line":"---","mine":0,"thiers":0,"score":0}
{"line":"---","mine":0,"thiers":0,"score":0}
{"line":"---","mine":0,"thiers":0,"score":0}
{"line":"---","mine":0,"thiers":0,"score":0}
{"line":"---","mine":0,"thiers":0,"score":0}
{"line":"---","mine":0,"thiers":0,"score":0}
{"line":"---","mine":0,"thiers":0,"score":0}
********************************************************
* Current Score : 0
********************************************************
* Options
********************************************************
{"index":0,"spot":"-","score":3}
{"index":1,"spot":"-","score":2}
{"index":2,"spot":"-","score":3}
{"index":3,"spot":"-","score":2}
{"index":4,"spot":"-","score":4}
{"index":5,"spot":"-","score":2}
{"index":6,"spot":"-","score":3}
{"index":7,"spot":"-","score":2}
{"index":8,"spot":"-","score":3}
********************************************************
* Recommendation for X is 2 (Score: 3)
********************************************************
```

# Via the Deployed API

* You can try it here:
  *  [http://tttapi.herokuapp.com/api/v1/--O-X-O--/X](http://tttapi.herokuapp.com/api/v1/--O-X-O--/X) 
  *  Source Code : [https://github.com/stujo/tictactoe-api](https://github.com/stujo/tictactoe-api)
