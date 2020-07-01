import request from './request';
import combineOptions from './utils/combineOptions';
import buildUrl from './utils/buildUrl';
import resolveOptionsFromArgs from './utils/resolveOptionsFromArgs';
import { events } from './events';

export const createThwack = function (defaults, parent) {
  // createThwack returns a function that accepts (url, options)
  //  or just (options), but calls request with just (options)
  const instance = (...args) => instance.request(resolveOptionsFromArgs(args));

  instance.defaults = defaults;

  instance.request = request.bind(instance);

  // Create convenience methods on this instance
  ['GET', 'DELETE', 'HEAD'].forEach((method) => {
    const methodKey = method.toLowerCase();
    instance[methodKey] = (url, options) =>
      instance.request({ ...options, method, url });
  });

  ['PUT', 'POST', 'PATCH'].forEach((method) => {
    const methodKey = method.toLowerCase();
    instance[methodKey] = (url, data, options) =>
      instance.request({ ...options, method, url, data });
  });

  instance.getUri = (options) => {
    const combinedOptions = combineOptions(instance, options);
    return buildUrl(combinedOptions);
  };

  instance.create = (options) => {
    const createOptions = combineOptions(instance, options);
    return createThwack(createOptions, instance);
  };

  events(instance, parent);

  return instance;
};
