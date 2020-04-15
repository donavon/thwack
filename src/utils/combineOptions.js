import deepSpreadOptions from './deepSpreadOptions';

const combineOptions = (instance, options) =>
  deepSpreadOptions(instance.defaultOptions, options);

export default combineOptions;
