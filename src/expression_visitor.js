ExpressionVisitor = {
  visit: function(expression, callback) {
    switch (expression.type) {
      case 'Identifier':
      case 'Literal':
        callback(expression);
        break;
      case 'BinaryExpression':
        callback(expression.left);
        callback(expression.right);
        break;
      case 'CallExpression':
        callback(expression.callee);
        expression.arguments.forEach(callback);
        break;
      case 'ConditionalExpression':
        callback(expression.test);
        callback(expression.consequent);
        callback(expression.alternate);
        break;
      case 'MemberExpression':
        callback(expression.object);
        if (expression.computed) {
          callback(expression.property);
        }
        break;
      case 'UnaryExpression':
        callback(expression.argument);
        break;
      default:
        console.log('Ignoring ' + expression.type);
    }
  },

  getIdentifiers: function(expression) {
    var identifiers = [];
    var seen = {};
    var identifierCollector = function(expression) {
      if (expression.type === 'Identifier') {
        if (!seen[expression.name]) {
          identifiers.push(expression.name);
          seen[expression.name] = true;
        }
      } else if (expression.type !== 'Literal') {
        ExpressionVisitor.visit(expression, identifierCollector);
      }
    };
    ExpressionVisitor.visit(expression, identifierCollector);
    return identifiers;
  },
};

module.exports = ExpressionVisitor;
