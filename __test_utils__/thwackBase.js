import thwack from '../src/core';
import ThwackResponse from '../src/core/ThwackResponse';
import { createMockFetch, fooBarData, defaultHeaders } from './jestUtils';

const run = async () => {
  describe('Thwack base', () => {
    it('returns a promise', () => {
      const fetch = createMockFetch();
      const fn = thwack('http://foo.com/', { fetch });
      expect(fn instanceof Promise).toBe(true);
    });
    it('thwack(options) resolves with a ThwackResponse object', async () => {
      const fetch = createMockFetch();
      const options = {
        url: 'http://foo.com/',
        fetch,
        foo: 'bar',
      };
      const data = await thwack(options);
      expect(data instanceof ThwackResponse).toBe(true);
    });
    it('thwack(url, options) resolves with a ThwackResponse object', async () => {
      const fetch = createMockFetch();
      const options = {
        url: 'http://foo.com/',
        fetch,
        foo: 'bar',
      };
      const data = await thwack(options);
      expect(fetch).toBeCalledWith(
        'http://foo.com/',
        expect.objectContaining({ foo: 'bar' })
      );
      expect(data instanceof ThwackResponse).toBe(true);
    });
    it('can be passed a fully qualified URL', async () => {
      const fetch = createMockFetch();
      await thwack('http://donavon.com/', { fetch });
      expect(fetch).toBeCalledWith(
        'http://donavon.com/',
        expect.objectContaining({
          headers: defaultHeaders,
        })
      );
    });
    it('can be passed a URL with params in the URL (ex: "/order/:id")', async () => {
      const fetch = createMockFetch();
      await thwack('http://donavon.com/foo/:id', {
        fetch,
        params: { id: 123 },
      });
      expect(fetch).toBeCalledWith(
        'http://donavon.com/foo/123',
        expect.objectContaining({
          headers: defaultHeaders,
        })
      );
    });
    it('can be passed a URL with params which build them as a search query', async () => {
      const fetch = createMockFetch();
      await thwack('http://donavon.com/foo', { fetch, params: { id: 123 } });
      expect(fetch).toBeCalledWith(
        'http://donavon.com/foo?id=123',
        expect.objectContaining({
          headers: defaultHeaders,
        })
      );
    });
    it('can be passed a URL with an existing search query (ex: "/order?a=456")', async () => {
      const fetch = createMockFetch();
      await thwack('http://donavon.com/foo?a=456', {
        fetch,
        params: { id: 123 },
      });
      expect(fetch).toBeCalledWith(
        'http://donavon.com/foo?a=456&id=123',
        expect.objectContaining({
          headers: defaultHeaders,
        })
      );
    });
    it('sorts param keys when building search query', async () => {
      const fetch = createMockFetch();
      await thwack('http://donavon.com/foo?foo=foo', {
        fetch,
        params: { b: 'b', c: 'c', a: 'a' },
      });
      expect(fetch).toBeCalledWith(
        'http://donavon.com/foo?foo=foo&a=a&b=b&c=c',
        expect.objectContaining({
          headers: defaultHeaders,
        })
      );
    });
    it('defaults to POST is data is present and method not specified', async () => {
      const fetch = createMockFetch();
      await thwack('http://foo.com/', {
        method: 'foo',
        fetch,
        data: fooBarData,
      });
      expect(fetch).toBeCalledWith(
        'http://foo.com/',
        expect.objectContaining({
          headers: { 'content-type': 'application/json', ...defaultHeaders },
          body: JSON.stringify(fooBarData),
          method: 'foo',
        })
      );
      await thwack('http://foo.com/', { fetch, data: fooBarData });
      expect(fetch).toBeCalledWith(
        'http://foo.com/',
        expect.objectContaining({
          headers: { 'content-type': 'application/json', ...defaultHeaders },
          body: JSON.stringify(fooBarData),
          method: 'post',
        })
      );
    });
    it('encode only if content-type is application/json', async () => {
      const fetch = createMockFetch();
      await thwack('http://foo.com/', {
        fetch,
        headers: { 'content-type': 'text/plain' },
        data: 'this is plain text',
      });
      expect(fetch).toBeCalledWith(
        'http://foo.com/',
        expect.objectContaining({
          headers: { 'content-type': 'text/plain', ...defaultHeaders },
          body: 'this is plain text',
          method: 'post',
        })
      );
      await thwack('http://foo.com/', {
        fetch,
        headers: { 'content-type': 'application/json' },
        data: fooBarData,
      });
      expect(fetch).toBeCalledWith(
        'http://foo.com/',
        expect.objectContaining({
          headers: { 'content-type': 'application/json', ...defaultHeaders },
          body: JSON.stringify(fooBarData),
          method: 'post',
        })
      );
    });

    it('does not override method (if specified) when data present', async () => {
      const fetch = createMockFetch();
      await thwack('http://foo.com/', {
        fetch,
        headers: { 'content-type': 'text/plain' },
        data: 'this is plain text',
        method: 'FOO',
      });
      expect(fetch).toBeCalledWith(
        'http://foo.com/',
        expect.objectContaining({
          headers: { 'content-type': 'text/plain', ...defaultHeaders },
          body: 'this is plain text',
          method: 'FOO',
        })
      );
    });

    describe('when response does not specify a content-type', () => {
      it('defaults to text parsing', async () => {
        const fetch = createMockFetch();
        // patch mock fetch to not return any headers
        fetch.response.headers = {
          entries: () => [],
        };
        const { data } = await thwack('http://foo.com/', { fetch });
        expect(data).toEqual('text');
      });
    });

    describe('when response is application/json', () => {
      it('resolves with a parsed JSON object', async () => {
        const fetch = createMockFetch();
        const { data } = await thwack('http://foo.com/', { fetch });
        expect(data).toEqual(fooBarData);
      });
      it('resolves with a text if options.responseParserMap says it should use "text"', async () => {
        const fetch = createMockFetch();
        const { data } = await thwack('http://foo.com/', {
          fetch,
          responseParserMap: { 'application/json': 'text' },
        });
        expect(data).toEqual('text');
      });
      it('resolves with a text if responseType = "text"', async () => {
        const fetch = createMockFetch();
        const { data } = await thwack('http://foo.com/', {
          fetch,
          responseType: 'text',
        });
        expect(data).toEqual('text');
      });
      it('resolves with a stream if responseType = "stream"', async () => {
        const fetch = createMockFetch();
        const { data } = await thwack('http://foo.com/', {
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
        const { data } = await thwack('http://foo.com/', { fetch });
        expect(data).toEqual(fooBarData);
      });
    });

    describe('when response is NOT application/json', () => {
      it('resolves with the body text as a string', async () => {
        const fetch = createMockFetch({
          contentType: '',
          textResult: 'footext',
        });
        const { data } = await thwack('http://foo.com/', { fetch });
        expect(data).toBe('footext');
      });
    });

    describe('when the fetch returns an non-2xx status', () => {
      it('throws a ThwackResponseError', async (done) => {
        const fetch = createMockFetch({ status: 400, textResult: 'footext' });
        try {
          await thwack('http://foo.com/', { fetch });
        } catch (ex) {
          expect(ex instanceof thwack.ThwackResponseError).toBe(true);
          done(null, ex);
        }
      });
      it('throws a ThwackResponseError with message set to the error status', async () => {
        const fetch = createMockFetch({
          status: 404,
          textResult: 'footext',
        });
        await expect(thwack('http://foo.com/', { fetch })).rejects.toThrow(
          'Status 404'
        );
      });
      it('throws a ThwackResponseError with error.status', async (done) => {
        const fetch = createMockFetch({ status: 400, textResult: 'footext' });
        try {
          await thwack('http://foo.com/', { fetch });
        } catch (ex) {
          expect(ex.thwackResponse.status).toBe(400);
          expect(ex.thwackResponse.ok).toBe(false);
          done(null, ex);
        }
      });
      it('throws a ThwackResponseError with error.data', async (done) => {
        const fetch = createMockFetch({ status: 400, textResult: 'footext' });
        try {
          await thwack('http://foo.com/', { fetch });
        } catch (ex) {
          expect(ex.thwackResponse.data).toEqual(fooBarData);
          done(null, ex);
        }
      });
      it('throws a ThwackResponseError with error.statusText', async (done) => {
        const fetch = createMockFetch({ status: 403, textResult: 'footext' });
        try {
          await thwack('http://foo.com/', { fetch });
        } catch (ex) {
          expect(ex.thwackResponse.statusText).toBe('ok');
          done(null, ex);
        }
      });
      it('throws a ThwackResponseError with error.headers', async (done) => {
        const fetch = createMockFetch({ status: 403, textResult: 'footext' });
        try {
          await thwack('http://foo.com/', { fetch });
        } catch (ex) {
          expect(ex.thwackResponse.headers).toEqual({
            'content-type': 'application/json',
          });
          done(null, ex);
        }
      });
      it('throws a ThwackResponseError with error.response', async (done) => {
        const fetch = createMockFetch({ status: 403, textResult: 'footext' });
        try {
          await thwack('http://foo.com/', { fetch });
        } catch (ex) {
          expect(typeof ex.thwackResponse.response).toBe('object');
          done(null, ex);
        }
      });
    });

    describe('when options.validateStatus is provided', () => {
      it('when returns false throws on a 200 status', async (done) => {
        const validateStatus = () => false;
        const fetch = createMockFetch({ status: 200 });
        try {
          await thwack('http://foo.com/', { fetch, validateStatus });
        } catch (ex) {
          expect(ex instanceof thwack.ThwackResponseError).toBe(true);
          done(null, ex);
        }
      });
      it('when returns true does NOT throws on a 500 status', async () => {
        const validateStatus = () => true;
        const fetch = createMockFetch({
          status: 500,
        });
        const { data } = await thwack('http://foo.com/', {
          fetch,
          validateStatus,
        });
        expect(data).toEqual(fooBarData);
      });
    });

    describe('thwack convenience functions', () => {
      // eslint-disable-next-line no-restricted-syntax
      for (const method of ['post', 'put', 'patch']) {
        it(`thwack.${method}(name, data, options) defaults to ${method.toUpperCase()} and resolves with a ThwackResponse object`, async () => {
          const fetch = createMockFetch();
          const data = await thwack[method]('http://foo.com/', 'data', {
            fetch,
          });
          expect(fetch).toBeCalledWith(
            'http://foo.com/',
            expect.objectContaining({
              method,
              headers: {
                'content-type': 'application/json',
                ...defaultHeaders,
              },
              body: JSON.stringify('data'),
            })
          );
          expect(data instanceof ThwackResponse).toBe(true);
        });
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const method of ['get', 'delete', 'head']) {
        it(`thwack.${method}(name, options) defaults to ${method.toUpperCase()} and resolves with a ThwackResponse object`, async () => {
          const fetch = createMockFetch();
          const data = await thwack[method]('http://foo.com/', { fetch });
          expect(fetch).toBeCalledWith(
            'http://foo.com/',
            expect.objectContaining({
              method,
            })
          );
          expect(data instanceof ThwackResponse).toBe(true);
        });
      }

      it('thwack.request(options) resolves with a ThwackResponse object', async () => {
        const fetch = createMockFetch();
        const options = {
          url: 'http://foo.com/',
          fetch,
          foo: 'bar',
        };
        const data = await thwack.request(options);
        expect(fetch).toBeCalledWith(
          'http://foo.com/',
          expect.objectContaining({
            foo: 'bar',
          })
        );
        expect(data instanceof ThwackResponse).toBe(true);
      });
    });

    describe('thwack.create(options)', () => {
      const instance1 = thwack.create({ baseURL: 'http://one.com' });
      const instance2 = thwack.create({ baseURL: 'http://two.com' });

      it('will use the options as defaults in the new instance', async () => {
        const fetch = createMockFetch();
        const options = {
          url: 'foo',
          fetch,
          foo: 'bar',
        };
        await instance1(options);
        expect(fetch).toBeCalledWith(
          'http://one.com/foo',
          expect.objectContaining({
            foo: 'bar',
          })
        );
      });

      it('will be unique per instance', async () => {
        const fetch = createMockFetch();
        const options = {
          url: 'foo',
          fetch,
          foo: 'bar',
        };
        await instance2(options);
        expect(fetch).toBeCalledWith(
          'http://two.com/foo',
          expect.objectContaining({
            foo: 'bar',
          })
        );
      });

      it('will not effect the base thwack instance', async () => {
        const fetch = createMockFetch();
        const options = {
          url: 'http://foo.com/',
          fetch,
          foo: 'bar',
        };
        await thwack(options);
        expect(fetch).toBeCalledWith(
          'http://foo.com/',
          expect.objectContaining({
            foo: 'bar',
          })
        );
      });
    });

    describe('thwack.getUri', () => {
      it('is exposed on the instance', () => {
        expect(thwack.getUri({ url: 'http://foo.com/' })).toBe(
          'http://foo.com/'
        );
      });
      it('works with a fully qualified URL', () => {
        expect(thwack.getUri({ url: 'http://fully-qualified.com/bar' })).toBe(
          'http://fully-qualified.com/bar'
        );
      });
      it('works with a fully qualified URL on a child instance', () => {
        const instance = thwack.create({ baseURL: 'http:/api.example.com' });
        expect(instance.getUri({ url: 'http://fully-qualified.com/bar' })).toBe(
          'http://fully-qualified.com/bar'
        );
      });
      it('works from within an event listener on a parent instance', async () => {
        let eventUrl;
        const instance = thwack.create({
          baseURL: 'https://example.com/api/',
        });
        instance.addEventListener('request', (event) => {
          const { options } = event;
          eventUrl = thwack.getUri(options);
        });
        const fetch = createMockFetch();
        await instance('foo/:id', {
          fetch,
          foo: 'bar',
          params: { id: 123 },
        });
        expect(eventUrl).toBe('https://example.com/api/foo/123');
      });

      // not needed with buildUrl tests
      it.skip('will respect options.buildURL', () => {
        const options = { url: 'foo', baseURL: 'bar' };
        const callback = jest.fn((o) => o);
        const instance = thwack.create({ buildURL: callback });
        const res = instance.getUri(options);
        expect(callback).toBeCalledWith(expect.objectContaining(options));
        expect(res).toEqual(expect.objectContaining(options));
      });
    });

    describe('thwack.ThwackResponseError', () => {
      it('is exported as an instance of Error', () => {
        expect(new thwack.ThwackResponseError({}) instanceof Error).toBe(true);
      });
      it('is exported on the main instance only', () => {
        const fetch = createMockFetch();
        const instance = thwack.create({ fetch });
        expect(instance.ThwackResponseError).toBe(undefined);
      });
    });
  });

  describe('thwack.ThwackResponse', () => {
    it('is exported as an instance of ThwackResponse', () => {
      expect(new thwack.ThwackResponse({}, {}) instanceof ThwackResponse).toBe(
        true
      );
    });
    it('use status to determine ok (defaults to 2xx)', () => {
      expect(new thwack.ThwackResponse({ status: 199 }, {}).ok).toBe(false);
      expect(new thwack.ThwackResponse({ status: 200 }, {}).ok).toBe(true);
      expect(new thwack.ThwackResponse({ status: 299 }, {}).ok).toBe(true);
      expect(new thwack.ThwackResponse({ status: 300 }, {}).ok).toBe(false);
    });
    it('is not effected by options.validateStatus', () => {
      const validateStatus = (s) => s >= 400 && s < 500;
      expect(
        new thwack.ThwackResponse({ status: 199 }, { validateStatus }).ok
      ).toBe(false);
      expect(
        new thwack.ThwackResponse({ status: 200 }, { validateStatus }).ok
      ).toBe(true);
      expect(
        new thwack.ThwackResponse({ status: 299 }, { validateStatus }).ok
      ).toBe(true);
      expect(
        new thwack.ThwackResponse({ status: 300 }, { validateStatus }).ok
      ).toBe(false);
    });
    it('is exported on the main instance only', () => {
      const fetch = createMockFetch();
      const instance = thwack.create({ fetch });
      expect(instance.ThwackResponse).toBe(undefined);
    });
  });

  describe('thwack.all', () => {
    it('resolves to an array of results', async () => {
      const results = await thwack.all([
        Promise.resolve('foo'),
        Promise.resolve('bar'),
      ]);
      expect(results).toEqual(['foo', 'bar']);
    });
    it('is exported on the main instance only', () => {
      const fetch = createMockFetch();
      const instance = thwack.create({ fetch });
      expect(instance.all).toBe(undefined);
    });
  });

  describe('thwack.spread', () => {
    it('takes a callback returns a function', () => {
      expect(typeof thwack.spread()).toBe('function');
    });
    it('calling that function with an array will spread the array to the callback', (done) => {
      const callback = (...results) => {
        expect(results).toEqual([1, 2, 3]);
        done();
      };
      thwack.spread(callback)([1, 2, 3]);
    });
    it('is exported on the main instance only', () => {
      const fetch = createMockFetch();
      const instance = thwack.create({ fetch });
      expect(instance.spread).toBe(undefined);
    });
  });
};

export default run;
