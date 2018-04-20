// @flow
// @providesModule decorators/timer

const instances = new WeakMap();
let counter = 0;

function addToMap(instance) {
  const inst = { enabled: true, index: counter++ };

  instances.set(instance, inst);

  return inst;
}

function getIndex(instance) {
  return (instances.get(instance) || addToMap(instance)).index;
}

function toggle(instance, enabled) {
  (instances.get(instance) || addToMap(instance)).enabled = enabled;
}

function isEnabled(instance) {
  return instances.has(instance) ? instances.get(instance).enabled : addToMap(instance).enabled;
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

module.exports = function(target, key, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function(...args) {
    if (isEnabled(this)) {
      const instanceNum = getIndex(this);
      const timingName = `${this.constructor.name}#${instanceNum}.${key}`;
      const self = this;
      let retVal = null;

      console.time(timingName);
      retVal = fn.apply(self, args);

      if (isPromise(retVal)) {
        retVal.then(console.timeEnd.bind(console, timingName));
      } else {
        console.timeEnd(timingName);
      }

      return retVal;
    } else {
      return fn.call(this, arguments);
    }
  };

  return descriptor;
};

module.exports.enable = function(instance) {
  toggle(instance, true);

  return this;
};

module.exports.disable = function(instance) {
  toggle(instance, false);

  return this;
};

module.exports.release = function(instance) {
  instances.delete(instance);

  return this;
};
