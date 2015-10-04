var Model = require('../lib/tic_tac_toe_model');

describe('TicTacToeModel', function() {

    describe('imagineStateIfIPlay', function(){
       it('should mark X in 2th spot', function(){
          var model = new Model("O--O-----", "X")
          expect(model.imagineStateIfIPlay(2)).equal('O-XO-----');
       });
    });

    describe('presented with a winning opportunity', function() {
        it('should recommend completing the line at location 6', function() {
            var model = new Model("O--O-----", "O")
            var result = model.getRecommendation();
            expect(result.recommendation).equal(6);
        });
        it('should recommend completing the line at location 0', function() {
            var model = new Model("--O-X--OX", "X")
            var result = model.getRecommendation();
            expect(result.recommendation).equal(0);
        });
        it('should recommend completing the line at location 1', function() {
            var model = new Model("X-X-O--OX", "O")
            var result = model.getRecommendation();
            expect(result.recommendation).equal(1);
        });
    });

    describe('at the start of the game', function() {
        it('should recommend a center or a corner', function() {
            var model = new Model("---------", "O")
            var result = model.getRecommendation();
            expect(result.recommendation).to.not.equal(1);
            expect(result.recommendation).to.not.equal(3);
            expect(result.recommendation).to.not.equal(5);
            expect(result.recommendation).to.not.equal(7);
        });
    });

   describe('presented with a blocking opportunity', function() {
        it('should recommend blocking the line at location 6', function() {
            var model = new Model("O--O-----", "X")
            var result = model.getRecommendation();
            expect(result.recommendation).equal(6);
        });
        it('should recommend blocking the line at location 0', function() {
            var model = new Model("--O-X--OX", "O")
            var result = model.getRecommendation();
            expect(result.recommendation).equal(0);
        });
    });

   describe('presented with a possible trap', function() {
        it('should recommend forcing a placement over potential lines', function() {
            var model = new Model("--O-X-O--", "X")
            var result = model.getRecommendation();
            expect(result.recommendation).to.not.equal(0);
            expect(result.recommendation).to.not.equal(8);
        });
    });

});
