var TicTacToeView = require('./tic_tac_toe_view');
var TicTacToeModel = require('./tic_tac_toe_model');


module.exports = function TicTacToeApp(input, currentTurn, debug) {

    if (currentTurn != 'X' && currentTurn != 'O') {
        showUsage();
        return;
    }

    if (input.length != 9) {
        showUsage();
        return
    }

    function isDebugging() {
        return !!debug;
    }

    function showUsage() {
        console.log('Usage: Game State as Parameter 1 \'OX-XO----\' (9 characters \'X\', \'O\' or  \'-\')')
        console.log('       Current Turn as Parameter 2 \'X\' or  \'O\'')
    }

    var board = new TicTacToeModel(input, currentTurn);
    TicTacToeView.dump(board, isDebugging());
}
