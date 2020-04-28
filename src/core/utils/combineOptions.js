import deepSpreadOptions from './deepSpreadOptions';

const combineOptions = (instance, options) =>
  deepSpreadOptions(instance.defaults, options);

export default combineOptions;
