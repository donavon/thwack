import sortByEntry from './sortByEntry';

export const defaultParamSerializer = (params) =>
  Object.entries(params)
    .sort(sortByEntry)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
