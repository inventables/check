var esprima = require('esprima');
var Rephraser = require('./rephraser');

var check = function() {
  var checker = arguments[arguments.length - 1];
  if (typeof checker !== 'function') {
    throw new Error('Expected function as last argument to `check`, got ' + (typeof checker));
  }
  var values = [].slice.call(arguments, 0, arguments.length - 1);

  var parserInput = '(' + checker.toString() + ');';
  var checkerFunctionExpression = esprima.parse(parserInput, { range: true }).body[0].expression;
  var checkerStatements = checkerFunctionExpression.body.body;

  var rephraser = new Rephraser(parserInput);

  var checkerParamNames = checkerFunctionExpression.params.map(function(param) { return param.name });
  var runner = eval([].concat(
    '(function(assert) { return function checker(' + checkerParamNames.join(', ') + ') {',
    checkerStatements.map(rephraser.rephraseStatement.bind(rephraser)),
    '}; })'
  ).join('\n'));

  var failures = [];
  var assert = function(condition, message) {
    if (!condition) {
      throw new Error('Expected ' + message);
    }
  };

  try {
    checker = runner(assert);
    checker.apply(this, values);
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = check;
