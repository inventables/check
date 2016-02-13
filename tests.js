var check = require('./src/check');

var checkError = function(func, message) {
  var thrown;
  try {
    func();
  } catch (error) {
    thrown = error.message;
  }
  if (!thrown) {
    throw new Error('Expected an error (' + JSON.stringify(message) + ') but no error was thrown');
  } else if (thrown !== message) {
    throw new Error('Expected error ' + JSON.stringify(message) + ', got ' + JSON.stringify(thrown));
  } else {
    console.log('.');
  }
};

checkError(function() {
  check(false, function(value) {
    value === value;
    !value;
    value !== true;
    value === 14;
  });
}, 'Expected `value === 14`. Got `value`: false.');

checkError(function() {
  check(true, function(value) {
    value === value;
    value !== true;
    !value;
    value === 14;
  });
}, 'Expected `value !== true`. Got `value`: true.');

checkError(function() {
  check(5, function(value) {
    value === value;
    value !== true;
    !value;
    value === 14;
  });
}, 'Expected `!value`. Got `value`: 5.');

checkError(function() {
  check(NaN, function(value) {
    value === value;
    value !== true;
    !value;
    value === 14;
  });
}, 'Expected `value === value`. Got `value`: NaN.');

checkError(function() {
  check(10, function(value) {
    if (value % 4 === 0) {
      'red' === 'blue';
      'green' === 'orange';
    } else if (value % 4 === 1) {
      2 + 2 === 5;
      3 + 3 === 33;
    } else if (value % 4 === 2) {
      10 === 0x10;
      11 === 0x11;
    } else {
      [].length >= 1;
      ({})['abc'];
    }
  });
}, 'Expected `10 === 0x10`.');

checkError(function() {
  check(10, function(value) {
    if (value % 4 === 0)
      'red' === 'blue';
    else if (value % 4 === 1)
      2 + 2 === 5;
    else if (value % 4 === 2)
      10 === 0x10;
    else
      [].length >= 1;
  });
}, 'Expected `10 === 0x10`.');

checkError(function() {
  check(8, function(n) {
    while (n-- >= 0) {
      n % 5 > 0;
      n % 3 > 0;
    }
  });
}, 'Expected `n % 3 > 0`. Got `n % 3`: 0.');

checkError(function() {
  check(8, function(n) {
    while (n-- >= 0)
      n % 5 > 0;
    n % 3 > 0;
  });
}, 'Expected `n % 5 > 0`. Got `n % 5`: 0.');
