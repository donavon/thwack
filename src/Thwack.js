import request from './request';
import combineOptions from './utils/combineOptions';
import ThwackResponseError from './ThwackErrors/ThwackResponseError';
import ThwackRequestEvent from './ThwackEvents/ThwackRequestEvent';
import ThwackResponseEvent from './ThwackEvents/ThwackResponseEvent';
import ThwackResponse from './ThwackResponse';
import buildUrl from './utils/buildUrl';
import resolveOptionsFromArgs from './utils/resolveOptionsFromArgs';

// TODO extend EventTarget eventually
// this will simplify the add/remove event listener stuff
export default class Thwack {
  constructor(defaults, parent) {
    // accepts (url, options) or just (options), but calls
    // this.request with just (options)
    const instance = (...args) =>
      instance.request(resolveOptionsFromArgs(args));

    instance._parent = parent;
    instance.defaults = defaults;
    instance.ThwackResponseError = ThwackResponseError;
    instance.ThwackRequestEvent = ThwackRequestEvent;
    instance.ThwackResponseEvent = ThwackResponseEvent;
    instance.ThwackResponse = ThwackResponse;

    instance._depth = 0; // number of concurrent requests (errors at options.maxDepth)
    instance._listeners = {
      request: [],
      response: [],
      data: [],
      error: [],
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

  dispatchEvent(event) {
    const buildStack = (instance) => {
      const thisStack = instance._listeners[event.type];
      if (instance._parent) {
        return [buildStack(instance._parent), thisStack];
      }
      return thisStack;
    };

    const stack = buildStack(this).flat(Infinity);
    return (
      stack
        .reduce(
          (promise, listener) =>
            promise
              // call our next callback (unless propagationStopped was called)
              .then(
                // TODO use nullish coalescing when supported by microbundle, like this:
                // () => !event.propagationStopped ?? listener(event)
                () => {
                  this._depth += 1;
                  if (this._depth >= 5) {
                    throw new Error('Thwack: maximum request depth reached');
                  }
                  return event.propagationStopped ? undefined : listener(event);
                }
              )
              .finally(() => {
                this._depth -= 1;
              })
              // if callback returned payload (or a promise that resolves to payload)
              // then set the payload in the event object
              .then((payload) => {
                if (payload !== undefined) {
                  // eslint-disable-next-line no-param-reassign
                  event._payload = payload;
                }
              }),
          Promise.resolve() // start with a promise
        )
        // finally, return the event payload to the caller
        .then(() => event._payload)
    );
  }
}
