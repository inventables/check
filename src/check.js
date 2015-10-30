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
    '(function(pass, fail) { return function(' + checkerParamNames.join(', ') + ') {',
    checkerStatements.map(rephraser.rephraseStatement.bind(rephraser)),
    '}; })'
  ).join('\n'));

  var failures = [];
  var pass = function(expressionString) {};
  var fail = function(expressionString) {
    failures.push(expressionString);
  };

  checker = runner(pass, fail);
  checker.apply(this, values);

  if (failures.length === 0) {
    console.log('Everything was beautiful and nothing hurt.');
  } else {
    console.log('Got:');
    for (var index = 0; index < checkerParamNames.length; index++) {
      console.log('  ' + checkerParamNames[index] + ' = ' + JSON.stringify(values[index]));
    }
    console.log('Expected:');
    failures.forEach(function(failure) {
      console.log('  ' + failure);
    });
  }
  console.log();
};

module.exports = check;
