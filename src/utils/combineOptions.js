import deepSpreadOptions from './deepSpreadOptions';

// const combineOptions = (instance, options) => {
//   // if (instance._parent) {
//   //   return deepSpreadOptions(combineOptions(instance._parent), options);
//   // }
//   return deepSpreadOptions(instance.defaultOptions, options);
// };
const combineOptions = (instance, options) =>
  deepSpreadOptions(instance.defaultOptions, options);

export default combineOptions;
