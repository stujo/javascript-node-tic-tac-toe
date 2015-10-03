var input = ("" + process.argv[2]).toUpperCase();
var nextTurn = ("" + process.argv[3]).toUpperCase();

function showUsage(){
  console.log('Usage: Game State as Parameter 1 \'OX XO    \' (9 characters \'X\', \'O\' or  \' \')')
  console.log('       Next Turn as Parameter 2 \'X\' or  \'O\'')
}

if(nextTurn != 'X' && nextTurn != 'O'){
  showUsage();
  process.exit(1);
}

if(input.length != 9){
  showUsage();
  process.exit(1);
}


function BoardModel(state, nextTurn){

  var SCORES = [];
  SCORES[0]  = 0;
  SCORES[1]  = 1;
  SCORES[2]  = 9;
  SCORES[3]  = 81;

  var SEARCHES = {
    'X': /X/g,
    'O': /O/g
  };


   function otherTurn(){
    return 'X' == nextTurn ? 'O' : 'X';
   }

   function scoreLine(line){
     var myCount = countMarks(line, nextTurn);
     var thierCount = countMarks(line, otherTurn());
     if(myCount > 0){
       if(thierCount == 0){
         return SCORES[myCount];
       }
     }
     if(thierCount > 0){
       if(myCount == 0){
         return - SCORES[thierCount];
       }
     }
     return 0;
   }

   function countMarks(line, mark){
     var matches = line.match(SEARCHES[mark]);
     return matches ? matches.length : 0;
   }

   function imagineScore(imaginedState){
      var imaginedBoard = new BoardModel(imaginedState, otherTurn());
      return - imaginedBoard.lineSummary().score;
   }

   function imagineState(index) {
      return state.substr(0,index) + nextTurn + state.substr(index+1);
   }


   function possibilities(){

     var spots = state.split("");

     return spots.map(function(spot, index) {
        
        var possibleScore = 0;
        if(spot == " "){
          possibleScore = imagineScore(imagineState(index));
        }

        return {
          index: index,
          spot: spot,
          possibleScore: possibleScore
        }
     });
   }

   function lines(){
    return [
      row(0),
      row(1),
      row(2),
      col(0),
      col(1),
      col(2),
      diagonal1(),
      diagonal2(),
    ].map(function(line){
      return {line: line, score: scoreLine(line) };
    });
   }

   function lineSummary(){
    var l = lines();
    return {
      lines: l,
      score: l.reduce(function(memo, line){ return memo + line.score; }, 0)
    }
   }

   function row(i){
     return state.slice(i * 3,(i * 3) + 3);
   }

   function col(i){
     return state.charAt(i) + state.charAt(i + 3) + state.charAt(i + 6);
   }

   function diagonal1(){
     return state.charAt(0) + state.charAt(4) + state.charAt(8);
   }
   function diagonal2(){
     return state.charAt(2) + state.charAt(4) + state.charAt(6);
   }

   function dump(){
     console.log('***');
     var summary = lineSummary();
     for(var i=0; i < summary.lines.length; i++){
       console.log(summary.lines[i]);
     }

     console.log('***');
     console.log('Score:' + summary.score);
     console.log('***');

     var p = possibilities();
     for(var i=0; i < p.length; i++){
       console.log(p[i]);
     }
     console.log('***');
   }

   return {
     row: row,
     lineSummary: lineSummary,
     dump: dump
   }  
}

var BoardView = {
  render: function(model){
     console.log(model.row(0));
     console.log(model.row(1));
     console.log(model.row(2));
  }
}

var board = new BoardModel(input, nextTurn);
BoardView.render(board);

board.dump();


