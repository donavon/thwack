import request from './request';
import combineOptions from './utils/combineOptions';
import ThwackResponseError from './ThwackErrors/ThwackResponseError';
import buildUrl from './utils/buildUrl';
import resolveOptionsFromArgs from './utils/resolveOptionsFromArgs';
import ThwackStopPropagationError from './ThwackErrors/ThwackStopPropagationError';

// TODO extend EventTarget eventually
// this will simplify the add/remove event listener stuff
export default class Thwack {
  constructor(defaultOptions, parent) {
    // accepts (url, options) or just (options), but calls
    // this.request with just (options)
    const instance = (...args) =>
      instance.request(resolveOptionsFromArgs(args));

    instance._parent = parent;
    instance.defaultOptions = defaultOptions;
    instance.ThwackResponseError = ThwackResponseError;

    instance._listeners = {
      request: [],
      response: [],
    };

    instance.request = request.bind(instance);

    // bind all Thwack methods to instance
    const methods = Object.getOwnPropertyNames(
      this.constructor.prototype
    ).filter((methodName) => methodName !== 'constructor');
    methods.forEach((methodName) => {
      instance[methodName] = this[methodName].bind(instance);
    });

    // Create convenience methods on this instance
    ['get', 'delete', 'head'].forEach((method) => {
      instance[method] = (url, options) =>
        instance.request({ ...options, method, url });
    });

    ['put', 'post', 'patch'].forEach((method) => {
      instance[method] = (url, data, options) =>
        instance.request({ ...options, method, url, data });
    });

    return instance;
  }

  getUri(options) {
    const { url, baseURL, params } = combineOptions(this, options);
    return buildUrl(url, baseURL, params);
  }

  create(options) {
    const createOptions = combineOptions(this, options);
    return new Thwack(createOptions, this);
  }

  addEventListener(type, callback) {
    this._listeners[type].push(callback);
  }

  removeEventListener(type, callback) {
    this._listeners[type] = this._listeners[type].filter(
      (listener) => listener !== callback
    );
  }

  dispatchEvent(initialEvent) {
    const dispatchInstanceEvent = (instance, event) => {
      if (instance._parent) {
        dispatchInstanceEvent(instance._parent, event);
      }
      const stack = [...instance._listeners[event.type]];
      stack.forEach((listener) => listener(event));
    };

    try {
      dispatchInstanceEvent(this, initialEvent);
    } catch (ex) {
      if (!(ex instanceof ThwackStopPropagationError)) {
        throw ex;
      }
    }
    return !initialEvent.defaultPrevented;
  }
}
