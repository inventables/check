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
  var checkerParamNames = checkerFunctionExpression.params.map(function(param) { return param.name });

  var rephraser = new Rephraser(parserInput, checkerParamNames);
  var runner = eval([].concat(
    '(function(assert) { return function checker(' + checkerParamNames.join(', ') + ') {',
    checkerStatements.map(rephraser.rephraseStatement.bind(rephraser)),
    '}; })'
  ).join('\n'));

  var failures = [];
  var JSON_TYPES = { 'object': true, 'string': true };
  var LITERAL_TYPES = { 'boolean': true, 'number': true, 'undefined': true };
  var assert = function(condition, description, actuals) {
    if (!condition) {
      message = 'Expected `' + description + '`.';
      if (actuals != null && actuals.length > 0) {
        var descriptions = actuals.map(function(actual) {
          var descriptionValue;
          if (JSON_TYPES[typeof actual.value]) {
            descriptionValue = JSON.stringify(actual.value);
          } else if (LITERAL_TYPES[typeof actual.value]) {
            descriptionValue = actual.value;
          } else {
            descriptionValue = 'a ' + typeof actual.value;
          }
          return '`' + actual.description + '`: ' + descriptionValue;
        });
        message += ' Got ' + descriptions.join(', ') + '.';
      }
      throw new Error(message);
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
