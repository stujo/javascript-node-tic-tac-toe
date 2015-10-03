var TicTacToeApp = require('./lib/tic_tac_toe_app');

var input = ("" + process.argv[2]).toUpperCase().replace(/-/g, ' ');
var currentTurn = ("" + process.argv[3]).toUpperCase();
var debug = ("" + process.argv[4]).toUpperCase() == "DEBUG";

new TicTacToeApp(input, currentTurn, debug);




