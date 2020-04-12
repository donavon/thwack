import compatParser from '../src/utils/compatParser';

describe('compatParser', () => {
  it('converts parser type "document" to "formData"', () => {
    const res = compatParser('document');
    expect(res).toBe('formData');
  });
  it('converts parser type "arraybuffer" to "arrayBuffer"', () => {
    const res = compatParser('arraybuffer');
    expect(res).toBe('arrayBuffer');
  });
  it('passes others "as-is"', () => {
    const res = compatParser('foo');
    expect(res).toBe('foo');
  });
});
