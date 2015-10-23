var esprima = require('esprima');

var check = function() {
  var checker = arguments[arguments.length - 1];
  if (typeof checker !== 'function') {
    throw new Error('Expected function as last argument to `check`, got ' + (typeof checker));
  }
  var values = [].slice.call(arguments, 0, arguments.length - 1);

  var parserInput = '(' + checker.toString() + ');';
  var checkerFunctionExpression = esprima.parse(parserInput, { range: true }).body[0].expression;
  var checkerStatements = checkerFunctionExpression.body.body;

  var rephraseAsCheckWithLogging = function(statement) {
    var expression = getExpression(statement);
    if (expression) {
      var expressionString = parserInput.substring(expression.range[0], expression.range[1]);
      return [
        'if (' + expressionString + ') {',
        '  console.log("Yay! " + ' + JSON.stringify(expressionString) + ');',
        '} else {',
        '  console.log("Oops! Expected " + ' + JSON.stringify(expressionString) + ');',
        '}'
      ].join('\n');
    }
  };

  checker = eval([].concat(
    '(function (' + checkerFunctionExpression.params.map(function(param) { return param.name }).join(', ') + ') {',
    checkerStatements.map(rephraseAsCheckWithLogging),
    '})'
  ).join('\n'));
  checker.apply(this, values);
};

var getExpression = function(statement) {
  switch (statement.type) {
    case 'ExpressionStatement':
      return statement.expression;
    case 'ReturnStatement':
      return statement.argument;
    default:
      logApathy(statement.type);
  }
};

module.exports = check;
