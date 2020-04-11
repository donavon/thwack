import sortByEntry from '../src/utils/sortByEntry';

describe('sortByEntry', () => {
  it('returns a -1 if the key from A < the key from B', () => {
    const res = sortByEntry(['A', 'A'], ['B', 'B']);
    expect(res).toBe(-1);
  });
  it('returns a 1 if the key from A > the key from B', () => {
    const res = sortByEntry(['B', 'B'], ['A', 'A']);
    expect(res).toBe(1);
  });
  it('returns a 1 if the key from A = the key from B', () => {
    const res = sortByEntry(['A', 'A'], ['A', 'A']);
    expect(res).toBe(0);
  });
});
