var esprima = require('esprima');

var check = function() {
  var checker = arguments[arguments.length - 1];
  if (typeof checker !== 'function') {
    throw new Error('Expected function as last argument to `check`, got ' + (typeof checker));
  }
  var values = [].slice.call(arguments, 0, arguments.length - 1);
  var parsed = esprima.parse('(' + checker.toString() + ');');
  var funcExpression = parsed.body[0].expression;
  var funcParams = funcExpression.params;
  var funcStatements = funcExpression.body.body;
  funcStatements.forEach(checkStatement);
};

var checkStatement = function(statement) {
  switch (statement.type) {
    case 'ExpressionStatement':
      checkExpression(statement.expression);
      break;
    default:
      logApathy(statement.type);
  }
};

var checkExpression = function(expression) {
  switch (expression.type) {
    case 'Identifier':
      logHope(JSON.stringify(expression.name));
      break;
    case 'BinaryExpression':
      logHope(JSON.stringify(expression.left) + ' ' + expression.operator + ' ' + JSON.stringify(expression.right));
      break;
    default:
      logApathy(expression.type);
  }
};

var logHope = function(hopedCondition) {
  console.log('I sure hope ' + hopedCondition + '!!');
};

var logApathy = function(apatheticFactor) {
  console.log('I don\'t understand your ' + apatheticFactor + ' and I won\'t enforce it.');
};

module.exports = check;
