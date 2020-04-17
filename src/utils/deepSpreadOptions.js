const isObject = (obj) =>
  Object.prototype.toString.call(obj) === '[object Object]';

const deepSpreadOptions = (createOptions = {}, options = {}) => {
  const allKeys = Object.keys({
    ...createOptions,
    ...options,
  });

  return allKeys.reduce((combined, key) => {
    // TODO use nullish coalescing when supported by microbundle, like this:
    // const value = options[key] ?? createOptions[key];
    const value = options[key] != null ? options[key] : createOptions[key];

    return {
      ...combined,
      [key]: isObject(value)
        ? deepSpreadOptions(createOptions[key], options[key])
        : value,
    };
  }, {});
};

export default deepSpreadOptions;
