var Model = require('../lib/tic_tac_toe_model');

describe('TicTacToeModel', function() {

    describe('presented with a winning opportunity', function() {
        it('should recommend completing the line at location 6', function() {
            var model = Model("O--O-----", "O")
            var result = model.boardSummary().recommendation.index;
            expect(result).equal(6);
        });
        it('should recommend completing the line at location 0', function() {
            var model = Model("--O-X--OX", "X")
            var result = model.boardSummary().recommendation.index;
            expect(result).equal(0);
        });
        it('should recommend completing the line at location 1', function() {
            var model = Model("X-X-O--OX", "O")
            var result = model.boardSummary().recommendation.index;
            expect(result).equal(1);
        });
    });

    describe('at the start of the game', function() {
        it('should recommend a center or a corner', function() {
            var model = Model("---------", "O")
            var result = model.boardSummary().recommendation.index;
            expect(result).to.not.equal(2);
            expect(result).to.not.equal(3);
            expect(result).to.not.equal(5);
            expect(result).to.not.equal(7);
        });
    });

   describe('presented with a blocking opportunity', function() {
        it('should recommend blocking the line at location 6', function() {
            var model = Model("O--O-----", "X")
            var result = model.boardSummary().recommendation.index;
            expect(result).equal(6);
        });
        it('should recommend blocking the line at location 0', function() {
            var model = Model("--O-X--OX", "O")
            var result = model.boardSummary().recommendation.index;
            expect(result).equal(0);
        });
    });

});
