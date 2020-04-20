/**
 * @jest-environment jsdom
 */
import thwack from '../src';
import { createMockFetch } from '../__test_utils__/jestUtils';
import runBaseTests from '../__test_utils__/thwackBase';
import runEventTests from '../__test_utils__/thwackEvents';

describe('thwack running on JSDOM', () => {
  it('returns a promise', () => {
    const fetch = createMockFetch();
    const fn = thwack('http://foo.com', { fetch });
    expect(fn instanceof Promise).toBe(true);
  });

  it('can be passed a relative URL with the origin of the window.location', async () => {
    const fetch = createMockFetch();
    const { origin, pathname } = window.location;
    await thwack('foo', { fetch });
    expect(fetch).toBeCalledWith(
      `${origin}${pathname}foo`,
      expect.objectContaining({})
    );
  });

  it('works if a relative URL is given without specifying baseURL', async () => {
    const fetch = createMockFetch();
    let worked = true;
    try {
      await thwack('foo', { fetch });
    } catch (ex) {
      worked = false;
    }
    expect(worked).toBe(true);
  });
  it('works if a relative URL is given but you specify a baseURL', async () => {
    const fetch = createMockFetch();
    let worked = true;
    try {
      await thwack('foo', { fetch, baseURL: 'http://bar.com' });
    } catch (ex) {
      worked = false;
    }
    expect(worked).toBe(true);
  });
  runBaseTests();
  runEventTests();
});
