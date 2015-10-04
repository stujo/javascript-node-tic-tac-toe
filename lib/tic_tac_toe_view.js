var TicTacToeView = {
    render: function(model) {
        var output = [];
        output.push("#####");
        output.push("#" + model.row(0).replace(/-/g, ' ') + "#");
        output.push("#" + model.row(1).replace(/-/g, ' ') + "#");
        output.push("#" + model.row(2).replace(/-/g, ' ') + "#");
        output.push("#####");
        return output.join("\n");
    },

    dump: function(model, isDebugging) {
        var output = [];
        var summary = model.boardSummary();
        var recommendation = model.getRecommendation();
        output.push('********************************************************');
        output.push(this.render(model));
        output.push('********************************************************');
        if (isDebugging) {
            output.push('* Lines');
            output.push('********************************************************');
            for (var i = 0; i < summary.lines.length; i++) {
                output.push(JSON.stringify(summary.lines[i]));
            }
        }
        if (summary.complete) {
            output.push('********************************************************');
            output.push('* Game Over ********************************************');
            output.push('********************************************************');

            output.push('****** Player \'' + summary.complete.winner + '\' won on line ' + summary.complete.line + ' ************************');
            output.push('********************************************************');
        } else if (recommendation) {
            if (isDebugging) {
                output.push('********************************************************');
                output.push('* Current Score : ' + summary.score);
                output.push('********************************************************');
                output.push('* Options');
                output.push('********************************************************');
                for (var i = 0; i < recommendation.possibilities.length; i++) {
                    output.push(JSON.stringify(recommendation.possibilities[i]));
                }
                output.push('********************************************************');
            }
            output.push('* Recommendation for ' + model.currentTurn + ' is ' + recommendation.index + " (Score: " + recommendation.score + ")");
            output.push('********************************************************');
        } else {
            output.push('********************************************************');
            output.push('********* No moves available ***************************');
            output.push('********************************************************');
        }
        return output.join("\n");
    }
}

module.exports = TicTacToeView;
