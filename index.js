const WEAKMAP = typeof WeakMap !== 'undefined';

let instances = WEAKMAP ? new WeakMap() : [];
let counter   = 0;

function addToMap(instance) {
  let inst = {enabled: true, index: counter++};
  instances.set(instance, inst);

  return inst;
}

function getIndex(instance) {
  if (WEAKMAP) {
    return (instances.get(instance) || addToMap(instance)).index;
  }

  for (let i=0, l=instances.length; i<l; i++) {
    if (instances[i].obj === instance) {
      return i;
    }
  }

  return instances.push({obj: instance, enabled: true}) - 1;
}

function toggle(instance, enabled) {
  if (WEAKMAP) {
    (instances.get(instance) || addToMap(instance)).enabled = enabled;
  } else {
    instances[getIndex(instance)].enabled = enabled;
  }
}

function isEnabled(instance) {
  if (WEAKMAP) {
    return instances.has(instance) ? instances.get(instance).enabled : addToMap(instance).enabled;

  } else {
    return !!(instances[getIndex(instance)] || {}).enabled;
  }
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

module.exports = function(target, key, descriptor) {
  let fn = descriptor.value;

  descriptor.value = function() {

    if (isEnabled(this)) {
      let instanceNum = getIndex(this);
      let timingName  = `${this.constructor.name}#${instanceNum}.${key}`;
      let self        = this;
      let args        = arguments;
      let retVal      = null;

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
  if (WEAKMAP) {
    instances.delete(instance);
  } else {
    instances[getIndex(instance)] = null;
  }

  return this;
};
