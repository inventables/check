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
        '  pass(' + JSON.stringify(expressionString) + ');',
        '} else {',
        '  fail(' + JSON.stringify(expressionString) + ');',
        '}'
      ].join('\n');
    }
  };

  var checkerParamNames = checkerFunctionExpression.params.map(function(param) { return param.name });
  var runner = eval([].concat(
    '(function(pass, fail) { return function (' + checkerParamNames.join(', ') + ') {',
    checkerStatements.map(rephraseAsCheckWithLogging),
    '}; })'
  ).join('\n'));

  var pass = function(expressionString) {
    console.log('Yay! ' + expressionString);
  };
  var fail = function(expressionString) {
    console.log('Oops! Expected ' + expressionString);
  };

  checker = runner(pass, fail);
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
