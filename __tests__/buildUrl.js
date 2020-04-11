import buildUrl from '../src/utils/buildUrl';

const cases = [
  ['bar', 'http://example.com/foo', {}, 'http://example.com/bar'],
  ['bar', 'https://example.com/foo', {}, 'https://example.com/bar'],
  ['//x.com', 'http://example.com/', {}, 'http://x.com/'],
  ['//x.com', 'https://example.com/', {}, 'https://x.com/'],
  ['bar', 'http://example.com/foo/', {}, 'http://example.com/foo/bar'],
  ['/bar', 'http://example.com/foo/', {}, 'http://example.com/bar'],
  ['/', 'http://example.com/foo/', {}, 'http://example.com/'],
  ['bar?x=123', 'http://example.com/foo', {}, 'http://example.com/bar?x=123'],
  ['bar', 'http://example.com/foo', { x: 123 }, 'http://example.com/bar?x=123'],
  [
    'bar/:x',
    'http://example.com/foo/',
    { x: 123 },
    'http://example.com/foo/bar/123',
  ],
  [
    'bar?x=123',
    'http://example.com/foo',
    { a: 'a', c: 'c' },
    'http://example.com/bar?x=123&a=a&c=c',
  ],
  [
    'bar?x=123',
    'http://example.com/foo',
    { c: 'c', a: 'a' },
    'http://example.com/bar?x=123&a=a&c=c',
  ],
  [
    'http://a.example.com/',
    'http://b.example.com',
    {},
    'http://a.example.com/',
  ],
  ['http://a.example.com', 'http://b.example.com', {}, 'http://a.example.com/'],
];

describe('sortByEnbuildUrltry', () => {
  cases.forEach(([url, base, params, expectedResult]) => {
    it(`returns ${expectedResult} given buildUrl("${url}", "${base}")`, () => {
      const result = buildUrl(url, base, params);
      expect(result).toBe(expectedResult);
    });
  });
  it('allows params to be missing', () => {
    const result = buildUrl('foo', 'http://example.com');
    expect(result).toBe('http://example.com/foo');
  });
  it('throws if base is not fully qualified', () => {
    expect(() => buildUrl('foo', 'bar')).toThrow();
  });
});
