import thwack from '../src';
import { defaultOptions } from '../src/defaults';

const { headers: defaultHeaders } = defaultOptions;
const defaultBaseUrl = 'http://localhost/';
const fooBarData = { foo: 'bar' };
const defaultFetchOptions = {
  ...fooBarData,
  headers: defaultHeaders,
};

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

const createMockFetch = (options = {}) => {
  const {
    status = 200,
    ok = true,
    statusText = 'ok',
    contentType = 'application/json',
    jsonResult = fooBarData,
    textResult = 'text',
    body = '(stream)',
  } = options;

  const response = {
    status,
    statusText,
    ok,
    headers: {
      get: () => contentType,
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

describe('thwack', () => {
  it('returns a promise', () => {
    const fetch = createMockFetch();
    const fn = thwack('foo', { fetch });
    expect(fn instanceof Promise).toBe(true);
  });
  it('thwack(options) resolves with a ThwackResponse object', async () => {
    const fetch = createMockFetch();
    const data = await thwack('foo', {
      fetch,
      foo: 'bar',
    });
    expect(data).toEqual({
      data: fooBarData,
      headers: {
        'content-type': 'application/json',
      },
      status: 200,
      ok: true,
      statusText: 'ok',
      response: fetch.response,
    });
  });
  it('thwack(url, options) resolves with a ThwackResponse object', async () => {
    const fetch = createMockFetch();
    const data = await thwack({
      url: 'foo',
      fetch,
      foo: 'bar',
    });
    expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, defaultFetchOptions);
    expect(data).toEqual({
      data: fooBarData,
      headers: {
        'content-type': 'application/json',
      },
      status: 200,
      ok: true,
      statusText: 'ok',
      response: fetch.response,
    });
  });
  it('can be passed a relative URL with the origin of the window.location', () => {
    const fetch = createMockFetch();
    thwack('foo', { fetch });
    expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, {
      headers: defaultHeaders,
    });
  });
  it('can be passed a fully qualified URL', () => {
    const fetch = createMockFetch();
    thwack('http://donavon.com/', { fetch });
    expect(fetch).toBeCalledWith('http://donavon.com/', {
      headers: defaultHeaders,
    });
  });
  it('can be passed a URL with params in the URL (ex: "/order/:id")', () => {
    const fetch = createMockFetch();
    thwack('http://donavon.com/foo/:id', { fetch, params: { id: 123 } });
    expect(fetch).toBeCalledWith('http://donavon.com/foo/123', {
      headers: defaultHeaders,
    });
  });
  it('can be passed a URL with params which build them as a search query', () => {
    const fetch = createMockFetch();
    thwack('http://donavon.com/foo', { fetch, params: { id: 123 } });
    expect(fetch).toBeCalledWith('http://donavon.com/foo?id=123', {
      headers: defaultHeaders,
    });
  });
  it('can be passed a URL with an existing search query (ex: "/order?a=456")', () => {
    const fetch = createMockFetch();
    thwack('http://donavon.com/foo?a=456', { fetch, params: { id: 123 } });
    expect(fetch).toBeCalledWith('http://donavon.com/foo?a=456&id=123', {
      headers: defaultHeaders,
    });
  });
  it('sorts param keys when building search query', () => {
    const fetch = createMockFetch();
    thwack('http://donavon.com/foo?foo=foo', {
      fetch,
      params: { b: 'b', c: 'c', a: 'a' },
    });
    expect(fetch).toBeCalledWith('http://donavon.com/foo?foo=foo&a=a&b=b&c=c', {
      headers: defaultHeaders,
    });
  });
  it('defaults to POST is data is present and method not specified', async () => {
    const fetch = createMockFetch();
    await thwack('foo', { method: 'foo', fetch, data: fooBarData });
    expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, {
      headers: { 'content-type': 'application/json', ...defaultHeaders },
      body: JSON.stringify(fooBarData),
      method: 'foo',
    });
    await thwack('foo', { fetch, data: fooBarData });
    expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, {
      headers: { 'content-type': 'application/json', ...defaultHeaders },
      body: JSON.stringify(fooBarData),
      method: 'post',
    });
  });
  it('encode only if content-type is application/json', async () => {
    const fetch = createMockFetch();
    await thwack('foo', {
      fetch,
      headers: { 'content-type': 'text/plain' },
      data: 'this is plain text',
    });
    expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, {
      headers: { 'content-type': 'text/plain', ...defaultHeaders },
      body: 'this is plain text',
      method: 'post',
    });
    await thwack('foo', {
      fetch,
      headers: { 'content-type': 'application/json' },
      data: fooBarData,
    });
    expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, {
      headers: { 'content-type': 'application/json', ...defaultHeaders },
      body: JSON.stringify(fooBarData),
      method: 'post',
    });
  });

  it('does not override method (if specified) when data present', () => {
    const fetch = createMockFetch();
    thwack('foo', {
      fetch,
      headers: { 'content-type': 'text/plain' },
      data: 'this is plain text',
      method: 'FOO',
    });
    expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, {
      headers: { 'content-type': 'text/plain', ...defaultHeaders },
      body: 'this is plain text',
      method: 'FOO',
    });
  });

  describe('when response is application/json', () => {
    it('resolves with a parsed JSON object', async () => {
      const fetch = createMockFetch();
      const { data } = await thwack('foo', { fetch });
      expect(data).toEqual(fooBarData);
    });
    it('resolves with a text if options.responseParserMap says it should use "text"', async () => {
      const fetch = createMockFetch();
      const { data } = await thwack('foo', {
        fetch,
        responseParserMap: { 'application/json': 'text' },
      });
      expect(data).toEqual('text');
    });
    it('resolves with a text if responseType = "text"', async () => {
      const fetch = createMockFetch();
      const { data } = await thwack('foo', {
        fetch,
        responseType: 'text',
      });
      expect(data).toEqual('text');
    });
    it('resolves with a stream if responseType = "stream"', async () => {
      const fetch = createMockFetch();
      const { data } = await thwack('foo', {
        fetch,
        responseType: 'stream',
      });
      expect(data).toEqual('(stream)');
    });
  });
  describe('when response is application/json; charset=utf-8', () => {
    it('resolves with a parsed JSON object', async () => {
      const fetch = createMockFetch({
        contentType: 'application/json; charset=utf-8',
      });
      const { data } = await thwack('foo', { fetch });
      expect(data).toEqual(fooBarData);
    });
  });
  describe('when response is NOT application/json', () => {
    it('resolves with the body text as a string', async () => {
      const fetch = createMockFetch({ contentType: '', textResult: 'footext' });
      const { data } = await thwack('foo', { fetch });
      expect(data).toBe('footext');
    });
  });
  describe('when the fetch returns an non-2xx status', () => {
    it('throws a ThwackError with message set to the error status', async () => {
      const fetch = createMockFetch({
        status: 404,
        ok: false,
        textResult: 'footext',
      });
      await expect(thwack('foo', { fetch })).rejects.toThrow('Status 404');
    });
    it('throws a ThwackError with error.status', async (done) => {
      const fetch = createMockFetch({ ok: false, textResult: 'footext' });
      try {
        await thwack('foo', { fetch });
      } catch (ex) {
        expect(ex.thwackResponse.status).toBe(200);
        done(null, ex);
      }
    });
    it('throws a ThwackError with error.statusText', async (done) => {
      const fetch = createMockFetch({ ok: false, textResult: 'footext' });
      try {
        await thwack('foo', { fetch });
      } catch (ex) {
        expect(ex.thwackResponse.statusText).toBe('ok');
        done(null, ex);
      }
    });
    it('throws a ThwackError with error.headers', async (done) => {
      const fetch = createMockFetch({ ok: false, textResult: 'footext' });
      try {
        await thwack('foo', { fetch });
      } catch (ex) {
        expect(ex.thwackResponse.headers).toEqual({
          'content-type': 'application/json',
        });
        done(null, ex);
      }
    });
    it('throws a ThwackError with error.response', async (done) => {
      const fetch = createMockFetch({ ok: false, textResult: 'footext' });
      try {
        await thwack('foo', { fetch });
      } catch (ex) {
        expect(typeof ex.thwackResponse.response).toBe('object');
        done(null, ex);
      }
    });
  });
});

describe('thwack convenience functions', () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const method of ['post', 'put', 'patch']) {
    it(`thwack.${method}(name, data, options) defaults to ${method.toUpperCase()} and resolves with a ThwackResponse object`, async () => {
      const fetch = createMockFetch();
      const data = await thwack[method]('foo', 'data', { fetch });
      expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, {
        headers: { 'content-type': 'application/json', ...defaultHeaders },
        body: JSON.stringify('data'),
        method,
      });
      expect(data).toEqual({
        data: fooBarData,
        headers: {
          'content-type': 'application/json',
        },
        status: 200,
        ok: true,
        statusText: 'ok',
        response: fetch.response,
      });
    });
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const method of ['get', 'delete', 'head']) {
    it(`thwack.${method}(name, options) defaults to ${method.toUpperCase()} and resolves with a ThwackResponse object`, async () => {
      const fetch = createMockFetch();
      const data = await thwack[method]('foo', { fetch });
      expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, {
        headers: defaultHeaders,
        method,
      });
      expect(data).toEqual({
        data: fooBarData,
        headers: {
          'content-type': 'application/json',
        },
        status: 200,
        ok: true,
        statusText: 'ok',
        response: fetch.response,
      });
    });
  }

  it('thwack.request(options) resolves with a ThwackResponse object', async () => {
    const fetch = createMockFetch();
    const data = await thwack.request({
      url: 'foo',
      fetch,
      foo: 'bar',
    });
    expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, defaultFetchOptions);
    expect(data).toEqual({
      data: fooBarData,
      headers: {
        'content-type': 'application/json',
      },
      status: 200,
      ok: true,
      statusText: 'ok',
      response: fetch.response,
    });
  });
});

describe('thwack.create(options)', () => {
  const instance1 = thwack.create({ baseURL: 'http://one.com' });
  const instance2 = thwack.create({ baseURL: 'http://two.com' });

  it('will use the options as defaults in the new instance', async () => {
    const fetch = createMockFetch();
    const data = await instance1('foo', {
      fetch,
      foo: 'bar',
    });
    expect(fetch).toBeCalledWith('http://one.com/foo', defaultFetchOptions);
    expect(data).toEqual({
      data: fooBarData,
      headers: {
        'content-type': 'application/json',
      },
      status: 200,
      ok: true,
      statusText: 'ok',
      response: fetch.response,
    });
  });

  it('will be unique per instance', async () => {
    const fetch = createMockFetch();
    const data = await instance2('foo', {
      fetch,
      foo: 'bar',
    });
    expect(fetch).toBeCalledWith('http://two.com/foo', defaultFetchOptions);
    expect(data).toEqual({
      data: fooBarData,
      headers: {
        'content-type': 'application/json',
      },
      status: 200,
      ok: true,
      statusText: 'ok',
      response: fetch.response,
    });
  });

  it('will not effect the base thwack instance', async () => {
    const fetch = createMockFetch();
    const data = await thwack('foo', {
      fetch,
      foo: 'bar',
    });
    expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, defaultFetchOptions);
    expect(data).toEqual({
      data: fooBarData,
      headers: {
        'content-type': 'application/json',
      },
      status: 200,
      ok: true,
      statusText: 'ok',
      response: fetch.response,
    });
  });
});

describe('thwack.getUri', () => {
  it('is exposed on the instance', () => {
    expect(thwack.getUri({ url: 'foo' })).toBe(`${defaultBaseUrl}foo`);
  });
});

describe('thwack.ThwackResponseError', () => {
  it('is exported as an instance of Error', () => {
    expect(new thwack.ThwackResponseError({}) instanceof Error).toBe(true);
  });
});

describe('thwack EventTarget', () => {
  describe('calling addEventListener', () => {
    it('has its callback called with options before calling fetch', async () => {
      const fetch = createMockFetch();
      const callback = jest.fn();
      thwack.addEventListener('request', callback);
      const data = await thwack('foo', {
        fetch,
        foo: 'bar',
      });
      thwack.removeEventListener('request', callback);
      expect(callback).toHaveBeenCalledTimes(1);
      // expect(callback).toBeCalledWith({});
      expect(fetch).toBeCalledWith(`${defaultBaseUrl}foo`, defaultFetchOptions);
      expect(data).toEqual({
        data: fooBarData,
        headers: {
          'content-type': 'application/json',
        },
        status: 200,
        ok: true,
        statusText: 'ok',
        response: fetch.response,
      });
    });
    it('can be called multiple times and see the effects from the other callbacks', async () => {
      const fetch = createMockFetch();
      const callback1 = jest.fn((e) => {
        e.options = { ...e.options, url: `${e.options.url}bar` };
      });
      const callback2 = jest.fn((e) => {
        e.options = { ...e.options, url: `${e.options.url}bar` };
      });
      thwack.addEventListener('request', callback1);
      thwack.addEventListener('request', callback2);
      await thwack('foo', {
        fetch,
        foo: 'bar',
      });
      thwack.removeEventListener('request', callback2);
      thwack.removeEventListener('request', callback1);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(fetch).toBeCalledWith(
        `${defaultBaseUrl}foobarbar`,
        defaultFetchOptions
      );
    });
    it('a callback can call stopPropagation() to prevent additional callbacks from executing', async () => {
      const fetch = createMockFetch();
      const callback1 = jest.fn((e) => {
        e.options = { ...e.options, url: `${e.options.url}bar` };
        e.stopPropagation();
      });
      const callback2 = jest.fn((e) => {
        e.options = { ...e.options, url: `${e.options.url}bar` };
      });
      thwack.addEventListener('request', callback1);
      thwack.addEventListener('request', callback2);
      await thwack('foo', {
        fetch,
        foo: 'bar',
      });
      thwack.removeEventListener('request', callback2);
      thwack.removeEventListener('request', callback1);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(0);
      expect(fetch).toBeCalledWith(
        `${defaultBaseUrl}foobar`,
        defaultFetchOptions
      );
    });
    it('exceptions in callbacks make it out to the process what called request', async () => {
      const fetch = createMockFetch();
      const callback1 = jest.fn((e) => {
        throw new Error('boo!');
      });
      const callback2 = jest.fn((e) => {
        e.options = { ...e.options, url: `${e.options.url}bar` };
      });
      thwack.addEventListener('request', callback1);
      thwack.addEventListener('request', callback2);
      try {
        await thwack('foo', {
          fetch,
          foo: 'bar',
        });
      } catch (ex) {
        expect(ex.toString()).toBe('Error: boo!');
      }
      thwack.removeEventListener('request', callback2);
      thwack.removeEventListener('request', callback1);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(0);
      expect(fetch).toHaveBeenCalledTimes(0);
    });
    it('parent events happen before child events and a stopPropagation on the parent stops child events', async () => {
      const fetch = createMockFetch();
      const instance = thwack.create();
      const callback1 = jest.fn((e) => {
        e.options = { ...e.options, url: `${e.options.url}bar` };
        e.stopPropagation();
      });
      const callback2 = jest.fn((e) => {
        e.options = { ...e.options, url: `${e.options.url}bar` };
      });
      thwack.addEventListener('request', callback1);
      instance.addEventListener('request', callback2);
      await instance('foo', {
        fetch,
        foo: 'bar',
      });
      instance.removeEventListener('request', callback2);
      thwack.removeEventListener('request', callback1);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(0);
      expect(fetch).toBeCalledWith(
        `${defaultBaseUrl}foobar`,
        defaultFetchOptions
      );
    });
    it('a callback can call preventDefault() to prevent the fetch from happening', async () => {
      const fetch = createMockFetch();
      const callback = jest.fn((e) => {
        e.promise = Promise.resolve('preventDefault');
        e.preventDefault();
      });
      thwack.addEventListener('request', callback);
      const resp = await thwack('foo', {
        fetch,
        foo: 'bar',
      });
      thwack.removeEventListener('request', callback);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledTimes(0);
      expect(resp).toEqual('preventDefault');
    });
  });
  describe('calling removeEventListener', () => {
    it('is properly removed', async () => {
      const fetch = createMockFetch();
      const callback = jest.fn();
      thwack.addEventListener('request', callback);
      await thwack('foo', { fetch });
      expect(callback).toHaveBeenCalledTimes(1);
      thwack.removeEventListener('request', callback);
      await thwack('foo', { fetch });
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
