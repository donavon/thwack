import computeParser from '../src/utils/computeParser';
import { defaultParserMap } from '../src/defaults';

const testMap = {
  'foo/bar': 'foobar',
  foo: 'foo',
  default: 'default',
};

describe('computeParser', () => {
  it('uses the default map if none specified', () => {
    const [contentTypeHeader, value] = Object.entries(defaultParserMap)[0];
    const res = computeParser(contentTypeHeader);
    expect(res).toBe(value);
  });
  it('defaults to "text"', () => {
    const res = computeParser('foo');
    expect(res).toBe('text');
  });
  it('uses `parserMap` if specified', () => {
    const res = computeParser('foo', testMap);
    expect(res).toBe('foo');
  });
  it('works with complete contentType (ex: "application/json")', () => {
    const res = computeParser('foo/bar', testMap);
    expect(res).toBe('foobar');
  });
  it('works with category from the contentType (ex: "application")', () => {
    const res = computeParser('foo', testMap);
    expect(res).toBe('foo');
  });
  it('defaults to the category if specic not found (ex: "application/json" => "application"', () => {
    const res = computeParser('foo/baz', testMap);
    expect(res).toBe('foo');
  });
  it('respects the `default` key in the parser map', () => {
    const res = computeParser('blah', testMap);
    expect(res).toBe('default');
  });
});
