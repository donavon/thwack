import buildUrl from '../src/core/utils/buildUrl';

const baseCases = [
  ['bar', 'http://ex.co/foo', {}],
  ['bar', 'https://ex.co/foo', {}],
  ['bar', 'http://ex.co/foo/', {}],
  ['bar', 'http://ex.co/foo?a=b', {}],
  ['bar?x=y', 'http://ex.co/foo', {}],
  ['bar?x=y', 'http://ex.co/foo?a=b', {}],

  ['bar?x=123', 'http://ex.co/foo', {}],
  ['bar', 'http://ex.co/foo', { x: 123 }],
  ['bar/:x', 'http://ex.co/foo/', { x: 123 }],
  ['bar?x=123', 'http://ex.co/foo', { a: 'a', c: 'c' }],
  ['bar?x=123', 'http://ex.co/foo', { c: 'c', a: 'a' }],
  ['http://a.ex.co/', 'http://b.ex.co', {}],
  ['http://a.ex.co', 'http://b.ex.co/', {}],
  ['http://a.ex.co', 'http://b.ex.co', {}],

  ['/bar', 'http://ex.co/foo/', {}],
  ['/', 'http://ex.co/foo/', {}],

  // url missing protocol
  ['//x.com', 'http://ex.co/', {}],
  ['//x.com', 'https://ex.co/', {}],
  ['//x.com/foo', 'https://ex.co/', {}],
  ['//x.com/foo', 'https://ex.co/bar', {}],
];

const run = (cases, impl, title) => {
  const combinedCases = [...baseCases, ...cases];

  describe(title, () => {
    combinedCases.forEach(([url, baseURL, params]) => {
      try {
        const expectedResult = new URL(url, baseURL).href;
        it(`returns ${expectedResult} given buildUrl("${url}", "${baseURL}")`, () => {
          const result = buildUrl({ buildURL: impl, url, baseURL, params });
          expect(result).toBe(expectedResult);
        });
      } catch (ex) {
        expect(() =>
          buildUrl({ buildURL: impl, url, baseURL, params })
        ).toThrow();
      }
    });
    it('defaults URL to an empty string', () => {
      const result = buildUrl({
        buildURL: impl,
        baseURL: 'http://ex.co/',
      });
      expect(result).toBe('http://ex.co/');
    });
    it('allows params to be missing', () => {
      const result = buildUrl({
        buildURL: impl,
        url: 'foo',
        baseURL: 'http://ex.co/',
      });
      expect(result).toBe('http://ex.co/foo');
    });
    it('throws if relative url and base is not fully qualified', () => {
      expect(() =>
        buildUrl({ buildURL: impl, url: 'foo', baseURL: 'bar' })
      ).toThrow();
    });
    it('throws if relative url and base is undefined', () => {
      expect(() => buildUrl({ buildURL: impl, url: 'foo' })).toThrow();
    });
    it('accepts a base of undefined if url is fully qualified', () => {
      const result = buildUrl({
        buildURL: impl,
        url: 'http://ex.co/',
      });
      expect(result).toBe('http://ex.co/');
    });
  });
};

export default run;
