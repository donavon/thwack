const isObject = (obj) =>
  Object.prototype.toString.call(obj) === '[object Object]';

const deepSpreadOptions = (createOptions = {}, options = {}) => {
  const allkeys = Object.keys({
    ...createOptions,
    ...options,
  });

  const combined = {};

  allkeys.forEach((key) => {
    const value = options[key] || createOptions[key];
    combined[key] = isObject(value)
      ? deepSpreadOptions(createOptions[key], options[key])
      : value;
  });

  return combined;
};

export default deepSpreadOptions;
