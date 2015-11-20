function Rephraser(inputString) {
  this.inputString = inputString;
};

Rephraser.prototype = {
  inputForNode: function(node) {
    return this.inputString.substring(node.range[0], node.range[1]);
  },

  rephraseBlockStatement: function(statement) {
    return [
      '{',
      statement.body.map(this.rephraseStatement.bind(this)).join('\n'),
      '}'
    ].join('\n');
  },

  rephraseExpressionStatement: function(statement) {
    var expressionString = this.inputForNode(statement.expression);
    return 'assert(' + expressionString + ', ' + JSON.stringify(expressionString) + ');';
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
    return 'assert(' + expressionString + ', ' + JSON.stringify(expressionString) + ');';
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
      case 'BlockStatement':
        return this.rephraseBlockStatement(statement);
      case 'ExpressionStatement':
        return this.rephraseExpressionStatement(statement);
      case 'IfStatement':
        return this.rephraseIfStatement(statement);
      case 'ReturnStatement':
        return this.rephraseReturnStatement(statement);
      case 'WhileStatement':
        return this.rephraseWhileStatement(statement);
      case 'BreakStatement':
      case 'ContinueStatement':
      case 'EmptyStatement':
      case 'VariableDeclaration':
        return this.inputForNode(statement);
      default:
        console.log('Ignoring ' + statement.type);
    }
  },
};

module.exports = Rephraser;
