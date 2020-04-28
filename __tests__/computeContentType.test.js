import computeContentType from '../src/core/utils/computeContentType';

describe('computeContentType', () => {
  it('if passed a Blob, returns the type', () => {
    const blob = new Blob(['foo'], { type: 'text/foo' });
    const res = computeContentType(blob);
    expect(res).toBe('text/foo');
  });
  it('otherwise returns "application/json"', () => {
    const res = computeContentType('foo');
    expect(res).toBe('application/json');
  });
});
