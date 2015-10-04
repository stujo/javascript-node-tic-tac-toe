var SCORES = [];
SCORES[0] = 0;
SCORES[1] = 1;
SCORES[2] = 81;
SCORES[3] = (9 * 81);

var FIRST_GO_CORNER_PERCENTAGE = 0.7;

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

    // Randomly pick at corner at start of game 
    // FIRST_GO_CORNER_PERCENTAGE of the time
    //
    if (possibilities.length == 9 && (Math.random() < FIRST_GO_CORNER_PERCENTAGE)) {
        [0,2,6,8].forEach(function(corner_index) {
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

module.exports = function TicTacToeModel(state, currentTurn) {

    function currentPlayer() {
         return currentTurn;
    }
  
    function otherPlayer() {
        return 'X' == currentPlayer() ? 'O' : 'X';
    }

    function imagineScore(imaginedState) {
        var imaginedBoard = new TicTacToeModel(imaginedState, currentPlayer());
        return imaginedBoard.boardSummary().score;
    }

    function imagineStateIfIPlay(index) {
        return state.substr(0, index) + currentPlayer() + state.substr(index + 1);
    }

    function possibilities() {

        var spots = state.split("");

        return spots.map(function(spot, index) {

            var score = NaN;
            if (spot == "-") {
                score = imagineScore(imagineStateIfIPlay(index));
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
            var myCount = countMarks(line, currentPlayer());
            var thierCount = countMarks(line, otherPlayer());

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
                    winner: currentPlayer(),
                    line: index
                };
            } else if (line.thiers == 3) {
                return {
                    winner: otherPlayer(),
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
        }
        var s = l.reduce(function(memo, line) {
            return memo + line.score;
        }, 0);
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
        currentPlayer: currentPlayer(),
        row: row,
        boardSummary: boardSummary,
    }
}
