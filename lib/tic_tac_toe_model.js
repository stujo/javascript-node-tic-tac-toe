var SCORES = [];
SCORES[0] = 0;
SCORES[1] = 1;
SCORES[2] = 81;
SCORES[3] = (9 * 81);

var NEXT_TURN_MULTIPLIER = 1;

var FIRST_GO_CORNER_PERCENTAGE = 0.7;

var MAX_INCEPTION_LEVEL = 1;

var SEARCHES = {
    'X': /X/g,
    'O': /O/g
};

function scoreForCount(myCount, thierCount) {
    if (myCount > 0) {
        if (thierCount == 0) {
            return SCORES[myCount];
        }
    }
    if (thierCount > 0) {
        if (myCount == 0) {
            return -(SCORES[thierCount] * NEXT_TURN_MULTIPLIER);
        }
    }
    return 0;
}

function sample(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function countMarks(line, mark) {
    var matches = line.match(SEARCHES[mark]);
    return matches ? matches.length : 0;
}

function recommendationFrom(possibilities) {
    if (!possibilities || possibilities.length == 0) {
        return null
    }

    var recommendations = {
        score: NaN,
        options: []
    }

    // Randomly pick at corner at start of game 
    // FIRST_GO_CORNER_PERCENTAGE of the time
    //
    if (possibilities.length == 9 && (Math.random() < FIRST_GO_CORNER_PERCENTAGE)) {
        [0, 2, 6, 8].forEach(function(corner_index) {
            recommendations.options.push(possibilities[corner_index]);
        });
    } else {
        possibilities.forEach(function(spot) {
            if (isNaN(recommendations.score) ||
                spot.score > recommendations.score) {
                recommendations.score = spot.score;
                recommendations.options = [spot];
            } else if (spot.score == recommendations.score) {
                recommendations.options.push(spot);
            }
        });
    }
    return sample(recommendations.options);
}

function TicTacToeModel(state, currentTurn) {
    this.state = state;
    this.currentTurn = currentTurn;
    this.inceptionLevel = ("number" == typeof arguments[2] ? arguments[2] : 0);
}

TicTacToeModel.prototype.currentPlayer = function() {
    return this.currentTurn;
};

TicTacToeModel.prototype.otherPlayer = function() {
    return 'X' == this.currentPlayer() ? 'O' : 'X';
};

TicTacToeModel.prototype.imagineStateIfIPlay = function(index) {
    return this.state.substr(0, index) + this.currentPlayer() + this.state.substr(index + 1);
}

TicTacToeModel.prototype.playRecommendedMove = function() {
    var recommendation = this.getRecommendation();
    var recommendedState = this.imagineStateIfIPlay(recommendation.index);
    console.log("INCEPTING:" + this.inceptionLevel)
    return new TicTacToeModel(recommendedState, this.otherPlayer(), this.inceptionLevel + 1);
}

TicTacToeModel.prototype.preview = function(){
    return [this.currentPlayer(),this.row(0),this.row(1),this.row(2)].join("\n")
}

TicTacToeModel.prototype.imagineScore = function(imaginedState) {
    var imaginedBoard = new TicTacToeModel(imaginedState, this.otherPlayer(), this.inceptionLevel + 1);
    if (this.inceptionLevel < MAX_INCEPTION_LEVEL) {
        var inceptedBoard = imaginedBoard.playRecommendedMove();
        return inceptedBoard.boardSummary().score;
    } else {
        return -(imaginedBoard.boardSummary().score);
    }
}

TicTacToeModel.prototype.possibilities = function() {

    var spots = this.state.split("");

    var that = this;

    return spots.map(function(spot, index) {

        var score = NaN;
        if (spot == "-") {
            var imaginedState = that.imagineStateIfIPlay(index);
            score = that.imagineScore(imaginedState);
        }

        return {
            index: index,
            spot: spot,
            score: score
        }
    }).filter(function(spot) {
        return !isNaN(spot.score);
    });
}


TicTacToeModel.prototype.lines = function() {
    var me = this.currentPlayer();
    var them = this.otherPlayer();

    return [
        this.row(0),
        this.row(1),
        this.row(2),
        this.col(0),
        this.col(1),
        this.col(2),
        this.diagonal1(),
        this.diagonal2(),
    ].map(function(line) {
        var myCount = countMarks(line, me);
        var thierCount = countMarks(line, them);
        return {
            line: line,
            mine: myCount,
            thiers: thierCount
        };
    }).map(function(lineSummary) {
        lineSummary.score = scoreForCount(lineSummary.mine, lineSummary.thiers);
        return lineSummary;
    });
}

TicTacToeModel.prototype.winnerInfo = function(lines) {
    var me = this.currentPlayer();
    var them = this.otherPlayer();

    return lines.reduce(function(winner, line, index) {
        if (winner) {
            return winner;
        }

        if (line.mine == 3) {
            return {
                winner: me,
                line: index
            };
        } else if (line.thiers == 3) {
            return {
                winner: them,
                line: index
            };
        } else {
            return null;
        }
    }, null);

}

TicTacToeModel.prototype.boardSummary = function() {
    var l = this.lines();
    var c = this.winnerInfo(l);

    var scoreFromLines = l.reduce(function(memo, line) {
        return memo + line.score;
    }, 0);

    var scoreFromTraps = 0;

    var s = scoreFromLines + scoreFromTraps;
    return {
        complete: c,
        lines: l,
        score: s
    }
}

TicTacToeModel.prototype.getRecommendation = function() {
    var p = this.possibilities();
    var r = recommendationFrom(p);

    var result = {
        possibilities: p
    }
    if (r) {
        result.index = r.index;
        result.score = r.score;
    }

    return result;
}

TicTacToeModel.prototype.row = function(i) {
    return this.state.slice(i * 3, (i * 3) + 3);
}

TicTacToeModel.prototype.col = function(i) {
    return this.state.charAt(i) + this.state.charAt(i + 3) + this.state.charAt(i + 6);
}

TicTacToeModel.prototype.diagonal1 = function() {
    return this.state.charAt(0) + this.state.charAt(4) + this.state.charAt(8);
}

TicTacToeModel.prototype.diagonal2 = function() {
    return this.state.charAt(2) + this.state.charAt(4) + this.state.charAt(6);
}

module.exports = TicTacToeModel;
