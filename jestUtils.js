/* istanbul ignore file */
/* eslint-disable no-undef */
import { defaultOptions } from './src/defaults';
import deepSpreadOptions from './src/utils/deepSpreadOptions';

// polyfull fromEntries if not found
if (!Object.fromEntries) {
  Object.fromEntries = function ObjectFromEntries(iter) {
    const obj = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const pair of iter) {
      if (Object(pair) !== pair) {
        throw new TypeError('iterable for fromEntries should yield objects');
      }

      // Consistency with Map: contract is that entry has "0" and "1" keys, not
      // that it is an array or iterable.

      // eslint-disable-next-line quote-props
      const { '0': key, '1': val } = pair;

      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: val,
      });
    }

    return obj;
  };
}

export const { headers: defaultHeaders } = defaultOptions;
export const defaultBaseUrl = 'http://localhost/';
export const fooBarData = { foo: 'bar' };
export const defaultFetchOptions = {
  ...fooBarData,
  headers: defaultHeaders,
};

export const mergeDefaults = (options, defaults = defaultOptions) => {
  return deepSpreadOptions(defaults, options);
};

export const createMockFetch = (options = {}) => {
  const {
    status = 200,
    ok = true,
    statusText = 'ok',
    contentType = 'application/json',
    jsonResult = { foo: 'bar' },
    textResult = 'text',
    body = '(stream)',
  } = options;

  const response = {
    status,
    statusText,
    ok,
    headers: {
      entries: () => [['content-type', contentType]],
    },
    json: async () => jsonResult,
    text: async () => textResult,
    body,
  };
  const fetch = jest.fn(() => Promise.resolve(response));
  fetch.response = response;
  return fetch;
};
