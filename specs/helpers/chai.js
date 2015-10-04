// https://marcofranssen.nl/using-mocha-chai-sinon-to-test-node-js/

var chai = require('chai');

chai.config.includeStack = true;

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

