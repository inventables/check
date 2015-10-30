function Rephraser(inputString) {
  this.inputString = inputString;
};

Rephraser.prototype = {
  inputForNode: function(node) {
    return this.inputString.substring(node.range[0], node.range[1]);
  },

  rephraseExpressionStatement: function(statement) {
    var expressionString = this.inputForNode(statement.expression);
    return [
      'if (' + expressionString + ') {',
      '  pass(' + JSON.stringify(expressionString) + ');',
      '} else {',
      '  fail(' + JSON.stringify(expressionString) + ');',
      '}'
    ].join('\n');
  },

  rephraseReturnStatement: function(statement) {
    var expressionString = this.inputForNode(statement.argument);
    return [
      'if (' + expressionString + ') {',
      '  pass(' + JSON.stringify(expressionString) + ');',
      '} else {',
      '  fail(' + JSON.stringify(expressionString) + ');',
      '}'
    ].join('\n');
  },

  rephraseStatement: function(statement) {
    switch (statement.type) {
      case 'ExpressionStatement':
        return this.rephraseExpressionStatement(statement);
      case 'ReturnStatement':
        return this.rephraseReturnStatement(statement);
      default:
        console.log('Ignoring ' + statement.type);
    }
  },
};

module.exports = Rephraser;
