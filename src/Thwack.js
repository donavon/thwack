import request from './request';
import combineOptions from './utils/combineOptions';
import ThwackError from './ThwackError';
import buildUrl from './utils/buildUrl';
import resolveOptionsFromArgs from './utils/resolveOptionsFromArgs';

export default class Thwack {
  constructor(defaultOptions, parent) {
    const instance = (...args) =>
      instance.request(resolveOptionsFromArgs(args));

    instance._parent = parent;
    instance.defaultOptions = defaultOptions;
    instance.ThwackError = ThwackError;

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

  dispatchEvent(type, options) {
    const parentOptions = this._parent
      ? this._parent.dispatchEvent(type, options)
      : options;

    const stack = [...this._listeners[type]];
    return stack.reduce(
      (opts, listener) => listener(opts) || opts,
      parentOptions
    );
  }
}
