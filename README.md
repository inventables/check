# check

_“You better check yo self before you wreck yo self.” – Ice Cube_

---

**check** is a JavaScript assertion library with a very small API and an expectation syntax inspired by the way a developer would investigate the behavior of an app using the browser’s console or the `node` REPL.

#### Example usage

```js
var point = {
  x: 10,
  y: Math.exp(Math.PI) - Math.PI
};

check(point, function(point) {
  point.x === 10;
  point.y === 20;
});
```

#### Result

```
Error: Expected `point.y === 20`. Got `point.y`: 19.99909997918948.
```
