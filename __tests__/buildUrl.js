import buildUrl from '../src/core/utils/buildUrl';

const cases = [
  ['bar', 'http://ex.co/foo', {}, 'http://ex.co/bar'],
  ['bar', 'https://ex.co/foo', {}, 'https://ex.co/bar'],
  ['//x.com', 'http://ex.co/', {}, 'http://x.com/'],
  ['//x.com', 'https://ex.co/', {}, 'https://x.com/'],
  ['bar', 'http://ex.co/foo/', {}, 'http://ex.co/foo/bar'],
  ['/bar', 'http://ex.co/foo/', {}, 'http://ex.co/bar'],
  ['/', 'http://ex.co/foo/', {}, 'http://ex.co/'],
  ['bar?x=123', 'http://ex.co/foo', {}, 'http://ex.co/bar?x=123'],
  ['bar', 'http://ex.co/foo', { x: 123 }, 'http://ex.co/bar?x=123'],
  ['bar/:x', 'http://ex.co/foo/', { x: 123 }, 'http://ex.co/foo/bar/123'],
  [':x/:y', 'http://ex.co/', { x: 1, y: 2 }, 'http://ex.co/1/2'],
  ['http://ex.co/bar/:x', undefined, { x: 123 }, 'http://ex.co/bar/123'],
  [
    '?x=123',
    'http://ex.co/foo',
    { a: 'a', c: 'c' },
    'http://ex.co/foo?x=123&a=a&c=c',
  ],
  [
    '?x=123',
    'http://ex.co/foo/',
    { a: 'a', c: 'c' },
    'http://ex.co/foo/?x=123&a=a&c=c',
  ],
  [
    'bar?x=123',
    'http://ex.co/foo',
    { c: 'c', a: 'a' },
    'http://ex.co/bar?x=123&a=a&c=c',
  ],
  ['http://a.ex.co/', 'http://b.ex.co', {}, 'http://a.ex.co/'],
  ['http://a.ex.co', 'http://b.ex.co', {}, 'http://a.ex.co/'],
];
describe('buildUrl', () => {
  cases.forEach(([url, baseURL, params, expectedResult]) => {
    it(`returns ${expectedResult} given buildUrl("${url}", "${baseURL}")`, () => {
      const result = buildUrl({ url, baseURL, params });
      expect(result).toBe(expectedResult);
    });
  });
  it('defaults URL to an empty string', () => {
    const result = buildUrl({
      baseURL: 'http://ex.co/',
    });
    expect(result).toBe('http://ex.co/');
  });
  it('allows params to be missing', () => {
    const result = buildUrl({
      url: 'foo',
      baseURL: 'http://ex.co/',
    });
    expect(result).toBe('http://ex.co/foo');
  });
  it('throws if base is not fully qualified', () => {
    expect(() => buildUrl({ url: 'foo', baseURL: 'bar' })).toThrow();
  });
  it('will respect callback function in options.resolver', () => {
    const callback = jest.fn((url, base) => url + base);
    const options = { resolver: callback, url: 'foo', baseURL: 'bar' };
    const res = buildUrl(options);
    expect(callback).toBeCalledWith('foo', 'bar');
    expect(res).toEqual('foobar');
  });
  it('will respect callback function in options.paramsSerializer', () => {
    const callback = jest.fn((params) => JSON.stringify(params));
    const resolver = (url, base) => url + base;
    const options = {
      resolver,
      paramsSerializer: callback,
      params: { a: 'b' },
      url: 'foo',
      baseURL: 'bar',
    };
    const res = buildUrl(options);
    expect(callback).toBeCalledWith({ a: 'b' });
    expect(res).toEqual(`foobar?${JSON.stringify({ a: 'b' })}`);
  });
});
