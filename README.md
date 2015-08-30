# Timer Decorator

A simple Promise-aware ES7 timer decorator.  Just logs the processing time for
  the given function, or the time until the promise resolves (ignores rejected
  promises).  Note that the promise itself adds ~35-40ms in my basic testing.

## Installation

```sh
npm install --save-dev timer-decorator
```

## Usage

```js
import timer from 'timer-decorator';

class Foo {
  @timer;
  myMethod() {
    // ...
  }
}
```

will log something like:

```
Foo[0].myMethod: 123.456ms
```

The `[0]` is the instance #.

### Enable and Disable

To enable or disable the timer, call:

```js
timer.enable(this);
timer.disable(this);
```

where `this` is the class instance.

### Release

```js
timer.release(this);
```

to release the object and allow for gc to clean it.  Note that you probably
  shouldn't be using this in production anyway, so it's somewhat irrelevant if
  you don't do this (I'm just writing it for you to be aware that you will
  keep around _every_ object that has a timer in memory, forever, if `release`
  isn't called).
