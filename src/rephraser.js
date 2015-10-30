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

  rephraseIfStatement: function(statement) {
    var testExpressionString = this.inputForNode(statement.test);
    return [
      'if (' + testExpressionString + ') {',
      this.rephraseStatement(statement.consequent),
      '} else {',
      this.rephraseStatement(statement.alternate /* can be null */),
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

  rephraseWhileStatement: function(statement) {
    var testExpressionString = this.inputForNode(statement.test);
    return [
      'while (' + testExpressionString + ') {',
      this.rephraseStatement(statement.body),
      '}'
    ].join('\n');
  },

  rephraseStatement: function(statement) {
    if (!statement) {
      return;
    }
    switch (statement.type) {
      case 'ExpressionStatement':
        return this.rephraseExpressionStatement(statement);
      case 'IfStatement':
        return this.rephraseIfStatement(statement);
      case 'ReturnStatement':
        return this.rephraseReturnStatement(statement);
      case 'WhileStatement':
        return this.rephraseWhileStatement(statement);
      default:
        console.log('Ignoring ' + statement.type);
    }
  },
};

module.exports = Rephraser;
