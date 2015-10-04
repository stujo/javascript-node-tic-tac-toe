var SCORES = [];
SCORES[0] = 0;
SCORES[1] = 1;
SCORES[2] = 81;
SCORES[3] = (9 * 81);

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
            return -(SCORES[thierCount] * 2);
        }
    }
    return 0;
}

function sample(items){
  return items[Math.floor(Math.random()*items.length)];
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

    possibilities.forEach(function(spot) {
        if (isNaN(recommendations.score) ||
            spot.score > recommendations.score) {
            recommendations.score = spot.score;
            recommendations.options = [spot];
        } else if (spot.score == recommendations.score) {
            recommendations.options.push(spot);
        }
    });
    return sample(recommendations.options);
}

module.exports = function TicTacToeModel(state, currentTurn) {

    function otherTurn() {
        return 'X' == currentTurn ? 'O' : 'X';
    }

    function imagineScore(imaginedState) {
        var imaginedBoard = new TicTacToeModel(imaginedState, currentTurn);
        return imaginedBoard.boardSummary().score;
    }

    function imagineState(index) {
        return state.substr(0, index) + currentTurn + state.substr(index + 1);
    }

    function possibilities() {

        var spots = state.split("");

        return spots.map(function(spot, index) {

            var score = NaN;
            if (spot == " ") {
                score = imagineScore(imagineState(index));
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


    function lines() {
        return [
            row(0),
            row(1),
            row(2),
            col(0),
            col(1),
            col(2),
            diagonal1(),
            diagonal2(),
        ].map(function(line) {
            var myCount = countMarks(line, currentTurn);
            var thierCount = countMarks(line, otherTurn());

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

    function winnerInfo(lines) {
        return lines.reduce(function(winner, line, index) {
            if (winner) {
                return winner;
            }

            if (line.mine == 3) {
                return {
                    winner: currentTurn,
                    line: index
                };
            } else if (line.thiers == 3) {
                return {
                    winner: otherTurn(),
                    line: index
                };
            } else {
                return null;
            }
        }, null);

    }

    function boardSummary() {
        var l = lines();
        var c = winnerInfo(l);

        if (!c) {
            var p = possibilities();
            var r = recommendationFrom(p);
            var s = l.reduce(function(memo, line) {
                return memo + line.score;
            }, 0);
        }
        return {
            possibilities: p,
            recommendation: r,
            complete: c,
            lines: l,
            score: s
        }
    }


    function row(i) {
        return state.slice(i * 3, (i * 3) + 3);
    }

    function col(i) {
        return state.charAt(i) + state.charAt(i + 3) + state.charAt(i + 6);
    }

    function diagonal1() {
        return state.charAt(0) + state.charAt(4) + state.charAt(8);
    }

    function diagonal2() {
        return state.charAt(2) + state.charAt(4) + state.charAt(6);
    }

    return {
        currentTurn: currentTurn,
        row: row,
        boardSummary: boardSummary
    }
}
