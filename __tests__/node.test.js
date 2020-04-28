/**
 * @jest-environment node
 */
import thwack from '../src';
import { createMockFetch } from '../__test_utils__/jestUtils';
import runBaseTests from '../__test_utils__/thwackBase';
import runEventTests from '../__test_utils__/thwackEvents';

describe('thwack running on NodeJS', () => {
  it('returns a promise', () => {
    const fetch = createMockFetch();
    const fn = thwack('http://foo.com', { fetch });
    expect(fn instanceof Promise).toBe(true);
  });
  it('throws if a relative URL is given without specifying baseURL', async () => {
    const fetch = createMockFetch();
    let worked = true;
    try {
      await thwack('foo', { fetch });
    } catch (ex) {
      worked = false;
    }
    expect(worked).toBe(false);
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
