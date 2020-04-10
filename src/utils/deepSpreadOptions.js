const isObject = (obj) =>
  Object.prototype.toString.call(obj) === '[object Object]';

const deepSpreadOptions = (
  defaultOptions = {},
  createOptions = {},
  options = {}
) => {
  const allkeys = Object.keys({
    ...defaultOptions,
    ...createOptions,
    ...options,
  });

  const combined = {};

  allkeys.forEach((key) => {
    const value = options[key] || createOptions[key] || defaultOptions[key];
    combined[key] = isObject(value)
      ? deepSpreadOptions(defaultOptions[key], createOptions[key], options[key])
      : value;
  });

  return combined;
};

export default deepSpreadOptions;
