var input = ("" + process.argv[2]).toUpperCase().replace(/-/g,' ');
var currentTurn = ("" + process.argv[3]).toUpperCase();

function showUsage() {
    console.log('Usage: Game State as Parameter 1 \'OX-XO----\' (9 characters \'X\', \'O\' or  \' \')')
    console.log('       Current Turn as Parameter 2 \'X\' or  \'O\'')
}

if (currentTurn != 'X' && currentTurn != 'O') {
    showUsage();
    process.exit(1);
}

if (input.length != 9) {
    showUsage();
    process.exit(1);
}


function BoardModel(state, currentTurn) {

    var SCORES = [];
    SCORES[0] = 0;
    SCORES[1] = 1;
    SCORES[2] = 81;
    SCORES[3] = (9 * 81);

    var SEARCHES = {
        'X': /X/g,
        'O': /O/g
    };

    function otherTurn() {
        return 'X' == currentTurn ? 'O' : 'X';
    }

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

    function countMarks(line, mark) {
        var matches = line.match(SEARCHES[mark]);
        return matches ? matches.length : 0;
    }

    function imagineScore(imaginedState) {
        var imaginedBoard = new BoardModel(imaginedState, currentTurn);
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

    function recommendationFrom(possibilities) {
        if (!possibilities || possibilities.length == 0) {
            return null
        }
        var recommendedSpot = possibilities.reduce(function(spot, rec) {
            return spot.score > rec.score ? spot : rec;
        });
        return recommendedSpot;
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

    function isDebugging() {
        return process.argv[4] == 'debug'
    }

    function dump() {
        console.log('**************************************');
        var summary = boardSummary();
        if (isDebugging()) {
            console.log('* Lines ******************************');
            console.log('**************************************');
            for (var i = 0; i < summary.lines.length; i++) {
                console.log(summary.lines[i]);
            }
        }
        if (summary.complete) {
            console.log('**************************************');
            console.log('* Game Over **************************');
            console.log('**************************************');

            console.log('****** Player \'' + summary.complete.winner + '\' won on line ' + summary.complete.line + ' ******');
            console.log('**************************************');
        } else if (summary.recommendation) {
            if (isDebugging()) {
                console.log('**************************************');
                console.log('Current Score:' + summary.score);
                console.log('**************************************');
                console.log('* Options ****************************');
                console.log('**************************************');
                for (var i = 0; i < summary.possibilities.length; i++) {
                    console.log(summary.possibilities[i]);
                }
                console.log('**************************************');
            }
            console.log('Recommendation for ' + currentTurn + ' is ' + summary.recommendation.index + " (" + summary.recommendation.score + ")");
            console.log('**************************************');
        } else {
            console.log('**************************************');
            console.log('********* No moves available *********');
            console.log('**************************************');
        }
    }

    return {
        row: row,
        boardSummary: boardSummary,
        dump: dump
    }
}

var BoardView = {
    render: function(model) {
        console.log("#####");
        console.log("#" + model.row(0) + "#");
        console.log("#" + model.row(1) + "#");
        console.log("#" + model.row(2) + "#");
        console.log("#####");
    }
}

var board = new BoardModel(input, currentTurn);
BoardView.render(board);

board.dump();
