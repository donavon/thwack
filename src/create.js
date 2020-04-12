import thwack from './thwack';
import ThwackError from './ThwackError';
import deepSpreadOptions from './utils/deepSpreadOptions';

const create = (createOptions) => {
  const combineOptions = (options) => deepSpreadOptions(createOptions, options);

  const instance = async (...args) => {
    const [url, options] = args.length > 1 ? args : [, args[0]];
    return instance.request({ url, ...options });
  };

  instance.request = (options) => thwack(combineOptions(options));

  // Apply convenience methods
  ['get', 'delete', 'head'].forEach((method) => {
    instance[method] = async (url, options) =>
      instance({ ...options, method, url });
  });

  ['put', 'post', 'patch'].forEach((method) => {
    instance[method] = async (url, data, options) =>
      instance({ ...options, method, url, data });
  });

  instance.getUri = (options) => thwack.getUri(combineOptions(options));

  instance.create = (options) => create(combineOptions(options));

  instance.ThwackError = ThwackError;

  return instance;
};

export default create;
