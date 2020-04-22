import thwack from '../src';
import ThwackResponseEvent from '../src/ThwackEvents/ThwackResponseEvent';
import ThwackRequestEvent from '../src/ThwackEvents/ThwackRequestEvent';
import ThwackDataEvent from '../src/ThwackEvents/ThwackDataEvent';
import ThwackErrorEvent from '../src/ThwackEvents/ThwackErrorEvent';

import { createMockFetch } from './jestUtils';

const { ThwackResponseError, ThwackResponse } = thwack;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = async () => {
  describe('Thwack events', () => {
    describe('calling addEventListener("request")', () => {
      it('has its callback called with options before calling fetch', async () => {
        const fetch = createMockFetch();
        const callback = jest.fn();
        const options = {
          url: 'http://foo.com',
          fetch,
        };
        thwack.addEventListener('request', callback);
        await thwack(options);
        thwack.removeEventListener('request', callback);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toBeCalledWith(expect.any(ThwackRequestEvent));
        expect(fetch).toHaveBeenCalledTimes(1);
      });
      it('callbacks can return new options', async () => {
        const fetch = createMockFetch();
        const callback = (event) => {
          const options = { ...event.options, url: 'http://bob.com/' };
          return options;
        };
        const options = {
          url: 'http://foo.com',
          fetch,
          foo: 'bar',
        };
        thwack.addEventListener('request', callback);
        await thwack(options);
        thwack.removeEventListener('request', callback);
        expect(fetch).toBeCalledWith(
          'http://bob.com/',
          expect.objectContaining({
            foo: 'bar',
          })
        );
      });
      it('callbacks must return a valid options object', async () => {
        const fetch = createMockFetch();
        const callback = () => {
          const options = 'bob';
          return options;
        };
        const options = {
          url: 'http://foo.com',
          fetch,
          foo: 'bar',
        };
        thwack.addEventListener('request', callback);
        let didThrow;
        try {
          await thwack(options);
        } catch (ex) {
          didThrow = true;
        }
        thwack.removeEventListener('request', callback);
        expect(didThrow).toBe(true);
        expect(fetch).toHaveBeenCalledTimes(0);
      });
      it('async callbacks can alter options', async () => {
        const fetch = createMockFetch();
        const callback = async (event) => {
          await sleep(100);
          const options = { ...event.options, url: 'http://bob.com' };
          return options;
        };
        const options = {
          url: 'http://foo.com',
          fetch,
          foo: 'bar',
        };
        thwack.addEventListener('request', callback);
        await thwack(options);
        thwack.removeEventListener('request', callback);
        expect(fetch).toBeCalledWith(
          'http://bob.com/',
          expect.objectContaining({
            foo: 'bar',
          })
        );
      });
      it('can be called multiple times and see the effects from the other callbacks', async () => {
        const fetch = createMockFetch();
        const callback1 = jest.fn((e) => {
          const options = { ...e.options, url: `${e.options.url}bar` };
          return options;
        });
        const callback2 = jest.fn((e) => {
          const options = { ...e.options, url: `${e.options.url}bar` };
          return options;
        });
        thwack.addEventListener('request', callback1);
        thwack.addEventListener('request', callback2);
        await thwack('http://foo.com/', {
          fetch,
          foo: 'bar',
        });
        thwack.removeEventListener('request', callback2);
        thwack.removeEventListener('request', callback1);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(fetch).toBeCalledWith(
          'http://foo.com/barbar',
          expect.objectContaining({
            foo: 'bar',
          })
        );
      });
      it('a callback can call stopPropagation() to prevent additional callbacks from executing', async () => {
        const fetch = createMockFetch();
        const callback1 = jest.fn((e) => {
          const options = { ...e.options, url: `${e.options.url}bar` };
          e.stopPropagation();
          return options;
        });
        const callback2 = jest.fn((e) => {
          const options = { ...e.options, url: `${e.options.url}bar` };
          return options;
        });
        thwack.addEventListener('request', callback1);
        thwack.addEventListener('request', callback2);
        await thwack('http://foo.com/', {
          fetch,
          foo: 'bar',
        });
        thwack.removeEventListener('request', callback2);
        thwack.removeEventListener('request', callback1);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(0);
        expect(fetch).toBeCalledWith(
          'http://foo.com/bar',
          expect.objectContaining({
            foo: 'bar',
          })
        );
      });
      it('exceptions in callbacks make it out to the process what called request', async () => {
        const fetch = createMockFetch();
        const callback1 = jest.fn(() => {
          throw new Error('boo!');
        });
        const callback2 = jest.fn((e) => {
          e.options = { ...e.options, url: `${e.options.url}bar` };
        });
        thwack.addEventListener('request', callback1);
        thwack.addEventListener('request', callback2);
        try {
          await thwack('http://foo.com', {
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
          const options = { ...e.options, url: `${e.options.url}bar` };
          e.stopPropagation();
          return options;
        });
        const callback2 = jest.fn((e) => {
          const options = { ...e.options, url: `${e.options.url}bar` };
          return options;
        });
        thwack.addEventListener('request', callback1);
        instance.addEventListener('request', callback2);
        await instance('http://foo.com/', {
          fetch,
          foo: 'bar',
        });
        instance.removeEventListener('request', callback2);
        thwack.removeEventListener('request', callback1);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(0);
        expect(fetch).toBeCalledWith(
          'http://foo.com/bar',
          expect.objectContaining({
            foo: 'bar',
          })
        );
      });

      it('multiple parent events happen before child events', async () => {
        const fetch = createMockFetch();
        const instanceb = thwack.create();
        const instancec = instanceb.create();
        const callbacka = (e) => {
          const options = { ...e.options, url: `${e.options.url}/a` };
          return options;
        };
        const callbackb = (e) => {
          const options = { ...e.options, url: `${e.options.url}/b` };
          return options;
        };
        const callbackc = (e) => {
          const options = { ...e.options, url: `${e.options.url}/c` };
          return options;
        };
        thwack.addEventListener('request', callbacka);
        instanceb.addEventListener('request', callbackb);
        instancec.addEventListener('request', callbackc);
        await instancec('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        instancec.removeEventListener('request', callbackc);
        instanceb.removeEventListener('request', callbackb);
        thwack.removeEventListener('request', callbacka);
        expect(fetch).toBeCalledWith(
          'http://foo.com/a/b/c',
          expect.objectContaining({
            foo: 'bar',
          })
        );
      });
      it('events can be async and multiple parent events happen before child events', async () => {
        const fetch = createMockFetch();
        const instanceb = thwack.create();
        const instancec = instanceb.create();
        const callbacka = async (e) => {
          const options = { ...e.options, url: `${e.options.url}/a` };
          return options;
        };
        const callbackb = async (e) => {
          await sleep(100);
          const options = { ...e.options, url: `${e.options.url}/b` };
          return options;
        };
        const callbackc = (e) => {
          const options = { ...e.options, url: `${e.options.url}/c` };
          return options;
        };
        thwack.addEventListener('request', callbacka);
        instanceb.addEventListener('request', callbackb);
        instancec.addEventListener('request', callbackc);
        await instancec('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        instancec.removeEventListener('request', callbackc);
        instanceb.removeEventListener('request', callbackb);
        thwack.removeEventListener('request', callbacka);
        expect(fetch).toBeCalledWith(
          'http://foo.com/a/b/c',
          expect.objectContaining({
            foo: 'bar',
          })
        );
      });
      it('multiple parent events happen before child events and a stopPropagation on the parent stops child events', async () => {
        const fetch = createMockFetch();
        const instanceb = thwack.create();
        const instancec = instanceb.create();
        const callbacka = jest.fn((e) => {
          const options = { ...e.options, url: `${e.options.url}/a` };
          e.stopPropagation();
          return options;
        });
        const callbackb = jest.fn((e) => {
          const options = { ...e.options, url: `${e.options.url}/b` };
          return options;
        });
        const callbackc = jest.fn((e) => {
          const options = { ...e.options, url: `${e.options.url}/c` };
          return options;
        });
        thwack.addEventListener('request', callbacka);
        instanceb.addEventListener('request', callbackb);
        instancec.addEventListener('request', callbackc);
        await instancec('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        instancec.removeEventListener('request', callbackc);
        instanceb.removeEventListener('request', callbackb);
        thwack.removeEventListener('request', callbacka);
        expect(callbacka).toHaveBeenCalledTimes(1);
        expect(callbackb).toHaveBeenCalledTimes(0);
        expect(callbackc).toHaveBeenCalledTimes(0);
        expect(fetch).toBeCalledWith(
          'http://foo.com/a',
          expect.objectContaining({
            foo: 'bar',
          })
        );
      });
      it('a callback can call preventDefault() to prevent the fetch from happening', async () => {
        const fetch = createMockFetch();
        const callback = async (e) => {
          // e.promise = Promise.resolve('preventDefault');
          e.preventDefault();
          const { options } = e;
          return new ThwackResponse(
            {
              ok: true,
              status: 200,
              data: 'preventDefault',
              headers: { foo: 'bar' },
            },
            options
          );
        };
        const callback2 = () => {};
        thwack.addEventListener('request', callback);
        thwack.addEventListener('request', callback2);
        const resp = await thwack('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        thwack.removeEventListener('request', callback2);
        thwack.removeEventListener('request', callback);
        expect(fetch).toHaveBeenCalledTimes(0);
        expect(resp.data).toEqual('preventDefault');
      });
      it('a callback that calls preventDefault() must return a ThwackResponse', async () => {
        const fetch = createMockFetch();
        const callback = async (e) => {
          // e.promise = Promise.resolve('preventDefault');
          e.preventDefault();
          return 'foofoofoo';
        };
        const callback2 = () => {};
        thwack.addEventListener('request', callback);
        thwack.addEventListener('request', callback2);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(fetch).toHaveBeenCalledTimes(0);
        } finally {
          thwack.removeEventListener('request', callback2);
          thwack.removeEventListener('request', callback);
        }
      });
      it('a callback that calls preventDefault() must return a ThwackResponse with at least status', async () => {
        const fetch = createMockFetch();
        const callback = async (e) => {
          // e.promise = Promise.resolve('preventDefault');
          e.preventDefault();
          const { options } = e;
          return new ThwackResponse({}, options);
        };
        const callback2 = () => {};
        thwack.addEventListener('request', callback);
        thwack.addEventListener('request', callback2);
        const resp = await thwack('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        thwack.removeEventListener('request', callback2);
        thwack.removeEventListener('request', callback);
        expect(fetch).toHaveBeenCalledTimes(0);
        expect(resp.status).toBe(200);
      });
    });

    describe('calling addEventListener("response")', () => {
      it('has its callback called with ThwackResponseEvent before returning to caller', async () => {
        const fetch = createMockFetch();
        const callback = jest.fn();
        const options = {
          url: 'http://foo/com',
          fetch,
          foo: 'bar',
        };
        thwack.addEventListener('response', callback);
        await thwack(options);
        thwack.removeEventListener('response', callback);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toBeCalledWith(expect.any(ThwackResponseEvent));
      });
      it('a callback can call preventDefault() to respond with "fake" data', async () => {
        const fetch = createMockFetch();
        const callback = (e) => {
          // await sleep(100);
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse(
            { ok: true, status: 200, data: 'mock response' },
            options
          );
        };
        thwack.addEventListener('response', callback);
        const resp = await thwack('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        thwack.removeEventListener('response', callback);
        expect(resp.data).toEqual('mock response');
      });
      it('an async callback can call preventDefault() to respond with "fake" data', async () => {
        const fetch = createMockFetch();
        const callback = async (e) => {
          await sleep(100);
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse(
            { ok: true, status: 200, data: 'mock response' },
            options
          );
        };
        thwack.addEventListener('response', callback);
        const resp = await thwack('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        thwack.removeEventListener('response', callback);
        expect(resp.data).toEqual('mock response');
      });
      it('a callback can call preventDefault() to respond with a "fake" error', async () => {
        const fetch = createMockFetch();
        const callback = (e) => {
          // await sleep(100);
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse({ status: 409, data: 'boo!' }, options);
        };
        thwack.addEventListener('response', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex instanceof ThwackResponseError).toBe(true);
          expect(ex.thwackResponse.data).toBe('boo!');
        } finally {
          thwack.removeEventListener('response', callback);
        }
      });
      it('a callback can call preventDefault() to respond with a "fake" error and not provide data', async () => {
        const fetch = createMockFetch();
        const callback = (e) => {
          // await sleep(100);
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse({ status: 409 }, options);
        };
        thwack.addEventListener('response', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex instanceof ThwackResponseError).toBe(true);
        } finally {
          thwack.removeEventListener('response', callback);
        }
      });
      it('will cause thwack to throw if a callback called preventDefault() but did not return a ThwackResponse', async () => {
        const fetch = createMockFetch();
        const callback = async (e) => {
          e.preventDefault();
          return 'fred';
        };
        thwack.addEventListener('response', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex.name).toBe('Error');
        } finally {
          thwack.removeEventListener('response', callback);
        }
      });
      it('will cause thwack to throw if a callback blindly/recursively executes a request', async () => {
        const fetch = createMockFetch();
        const callback = async (e) => {
          e.preventDefault();
          return thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        };
        thwack.addEventListener('response', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex.name).toBe('Error');
        } finally {
          thwack.removeEventListener('response', callback);
        }
      });
    });

    describe('calling addEventListener("data")', () => {
      it('has its callback called with ThwackDataEvent before returning to caller', async () => {
        const fetch = createMockFetch();
        const callback = jest.fn();
        const options = {
          url: 'http://foo.com',
          fetch,
          foo: 'bar',
        };
        thwack.addEventListener('data', callback);
        await thwack(options);
        thwack.removeEventListener('data', callback);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toBeCalledWith(expect.any(ThwackDataEvent));
      });
      it('a callback can call preventDefault() to respond with "fake" data', async () => {
        const fetch = createMockFetch();
        const callback = (e) => {
          // await sleep(100);
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse(
            { ok: true, status: 200, data: 'mock response' },
            options
          );
        };
        thwack.addEventListener('data', callback);
        const resp = await thwack('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        thwack.removeEventListener('data', callback);
        expect(resp.data).toEqual('mock response');
      });
      it('an async callback can call preventDefault() to respond with "fake" data', async () => {
        const fetch = createMockFetch();
        const callback = async (e) => {
          await sleep(100);
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse(
            { ok: true, status: 200, data: 'mock response' },
            options
          );
        };
        thwack.addEventListener('data', callback);
        const resp = await thwack('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        thwack.removeEventListener('data', callback);
        expect(resp.data).toEqual('mock response');
      });
      it('a callback can call preventDefault() to respond with a "fake" error', async () => {
        const fetch = createMockFetch();
        const callback = (e) => {
          // await sleep(100);
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse({ status: 409, data: 'boo!' }, options);
        };
        thwack.addEventListener('data', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex instanceof ThwackResponseError).toBe(true);
          expect(ex.thwackResponse.data).toBe('boo!');
        } finally {
          thwack.removeEventListener('data', callback);
        }
      });
      it('a callback can call preventDefault() to respond with a "fake" error and not provide data', async () => {
        const fetch = createMockFetch();
        const callback = (e) => {
          // await sleep(100);
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse({ status: 409 }, options);
        };
        thwack.addEventListener('data', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex instanceof ThwackResponseError).toBe(true);
        } finally {
          thwack.removeEventListener('data', callback);
        }
      });
      it('will cause thwack to throw if a callback called preventDefault() but did not return a ThwackResponse', async () => {
        const fetch = createMockFetch();
        const callback = async (e) => {
          e.preventDefault();
          return 'fred';
        };
        thwack.addEventListener('data', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex.name).toBe('Error');
        } finally {
          thwack.removeEventListener('data', callback);
        }
      });
      it('will cause thwack to throw if a callback blindly/recursively executes a request', async () => {
        const fetch = createMockFetch();
        const callback = async (e) => {
          e.preventDefault();
          return thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        };
        thwack.addEventListener('data', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex.name).toBe('Error');
        } finally {
          thwack.removeEventListener('data', callback);
        }
      });
    });

    describe('calling addEventListener("error")', () => {
      it('has its callback called with ThwackDataEvent before returning to caller', async () => {
        const fetch = createMockFetch({ status: 500 });
        const callback = jest.fn();
        const options = {
          url: 'http://error.com',
          fetch,
          foo: 'bar',
        };
        thwack.addEventListener('error', callback);
        try {
          await thwack(options);
          // eslint-disable-next-line no-empty
        } catch (ex) {
        } finally {
          thwack.removeEventListener('error', callback);
        }
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toBeCalledWith(expect.any(ThwackErrorEvent));
      });
      it('a callback can call preventDefault() to respond with "fake" data', async () => {
        const fetch = createMockFetch({ status: 500 });
        const callback = (e) => {
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse(
            { status: 200, data: 'mock response' },
            options
          );
        };
        thwack.addEventListener('error', callback);
        const resp = await thwack('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        thwack.removeEventListener('error', callback);
        expect(resp.data).toEqual('mock response');
      });
      it('a callback can call preventDefault() to respond with "fake" data (defaulting status)', async () => {
        const fetch = createMockFetch({ status: 500 });
        const callback = (e) => {
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse({ data: 'mock response' }, options);
        };
        thwack.addEventListener('error', callback);
        const resp = await thwack('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        thwack.removeEventListener('error', callback);
        expect(resp.data).toEqual('mock response');
      });
      it('an async callback can call preventDefault() to respond with "fake" data', async () => {
        const fetch = createMockFetch({ status: 500 });
        const callback = async (e) => {
          await sleep(100);
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse(
            { ok: true, status: 200, data: 'mock response' },
            options
          );
        };
        thwack.addEventListener('error', callback);
        const resp = await thwack('http://foo.com', {
          fetch,
          foo: 'bar',
        });
        thwack.removeEventListener('error', callback);
        expect(resp.data).toEqual('mock response');
      });
      it('a callback can call preventDefault() to respond with a "fake" error', async () => {
        const fetch = createMockFetch({ status: 500 });
        const callback = (e) => {
          // await sleep(100);
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse({ status: 409, data: 'boo!' }, options);
        };
        thwack.addEventListener('error', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex instanceof ThwackResponseError).toBe(true);
          expect(ex.thwackResponse.status).toBe(409);
          expect(ex.thwackResponse.data).toBe('boo!');
        } finally {
          thwack.removeEventListener('error', callback);
        }
      });
      it('a callback can call preventDefault() to respond with a "fake" error and not provide data', async () => {
        const fetch = createMockFetch({ status: 500 });
        const callback = (e) => {
          // await sleep(100);
          e.preventDefault();
          const { options } = e.thwackResponse;
          return new ThwackResponse({ status: 409 }, options);
        };
        thwack.addEventListener('error', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex instanceof ThwackResponseError).toBe(true);
        } finally {
          thwack.removeEventListener('error', callback);
        }
      });
      it('will cause thwack to throw if a callback called preventDefault() but did not return a ThwackResponse', async () => {
        const fetch = createMockFetch({ status: 500 });
        const callback = async (e) => {
          e.preventDefault();
          return 'fred';
        };
        thwack.addEventListener('error', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex.name).toBe('Error');
        } finally {
          thwack.removeEventListener('error', callback);
        }
      });
      it('will cause thwack to throw if a callback blindly/recursively executes a request', async () => {
        const fetch = createMockFetch({ status: 500 });
        const callback = async (e) => {
          e.preventDefault();
          return thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        };
        thwack.addEventListener('error', callback);
        try {
          await thwack('http://foo.com', {
            fetch,
            foo: 'bar',
          });
        } catch (ex) {
          expect(ex.name).toBe('Error');
        } finally {
          thwack.removeEventListener('error', callback);
        }
      });
    });

    describe('calling removeEventListener', () => {
      it('is properly removed', async () => {
        const fetch = createMockFetch();
        const callback = jest.fn();
        thwack.addEventListener('request', callback);
        await thwack('http://foo.com', { fetch });
        expect(callback).toHaveBeenCalledTimes(1);
        thwack.removeEventListener('request', callback);
        await thwack('http://foo.com', { fetch });
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });
  });
};

export default run;
