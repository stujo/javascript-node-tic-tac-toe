var TicTacToeView = {
    render: function(model) {
        console.log("#####");
        console.log("#" + model.row(0) + "#");
        console.log("#" + model.row(1) + "#");
        console.log("#" + model.row(2) + "#");
        console.log("#####");
    },

    dump: function(model, isDebugging) {
        console.log('********************************************************');
        this.render(model);
        console.log('********************************************************');
        var summary = model.boardSummary();
        if (isDebugging) {
            console.log('* Lines');
            console.log('********************************************************');
            for (var i = 0; i < summary.lines.length; i++) {
                console.log(summary.lines[i]);
            }
        }
        if (summary.complete) {
            console.log('********************************************************');
            console.log('* Game Over ********************************************');
            console.log('********************************************************');

            console.log('****** Player \'' + summary.complete.winner + '\' won on line ' + summary.complete.line + ' ************************');
            console.log('********************************************************');
        } else if (summary.recommendation) {
            if (isDebugging) {
                console.log('********************************************************');
                console.log('* Current Score:' + summary.score);
                console.log('********************************************************');
                console.log('* Options');
                console.log('********************************************************');
                for (var i = 0; i < summary.possibilities.length; i++) {
                    console.log(summary.possibilities[i]);
                }
                console.log('********************************************************');
            }
            console.log('* Recommendation for ' + model.currentTurn + ' is ' + summary.recommendation.index + " (Score: " + summary.recommendation.score + ")");
            console.log('********************************************************');
        } else {
            console.log('********************************************************');
            console.log('********* No moves available ***************************');
            console.log('********************************************************');
        }
    }
}

module.exports = TicTacToeView;
