/* eslint-disable import/no-extraneous-dependencies */
/* istanbul ignore file */
/* eslint-disable no-undef */
import { defaultOptions } from '../src/core/defaults';
import deepSpreadOptions from '../src/core/utils/deepSpreadOptions';
import 'core-js/features/array/flat';
import 'core-js/features/object/from-entries';

export const { headers: defaultHeaders } = defaultOptions;
export const fooBarData = { foo: 'bar' };
export const defaultFetchOptions = {
  ...fooBarData,
  headers: defaultHeaders,
};

export const mergeDefaults = (options, defaults = defaultOptions) =>
  deepSpreadOptions(defaults, options);

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
