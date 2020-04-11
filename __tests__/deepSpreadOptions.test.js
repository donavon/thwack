import deepSpreadOptions from '../src/utils/deepSpreadOptions';

const cases = [
  [undefined, undefined, undefined, {}],
  [{ a: 'a' }, { a: 'b' }, { a: 'c' }, { a: 'c' }],
  [undefined, { a: 'b' }, { a: 'c' }, { a: 'c' }],
  [{ a: 'a' }, undefined, { a: 'c' }, { a: 'c' }],
  [{ a: 'a' }, { a: 'b' }, undefined, { a: 'b' }],
  [{ a: 'a' }, { b: 'b' }, { c: 'c' }, { a: 'a', b: 'b', c: 'c' }],
  [{ a: { a: 'a' } }, { a: 'b' }, { a: 'c' }, { a: 'c' }],
  [{ a: 'a' }, { a: 'b' }, { a: { a: 'c' } }, { a: { 0: 'b', a: 'c' } }],
  [{ a: { a: 'a' } }, { a: { a: 'b' } }, { a: { a: 'c' } }, { a: { a: 'c' } }],
  [{ a: { a: 'a' } }, {}, {}, { a: { a: 'a' } }],
  [{ a: { a: 'a' } }, { a: { a: 'b' } }, {}, { a: { a: 'b' } }],
  [{ a: { a: 'a' } }, { a: { b: 'b' } }, {}, { a: { a: 'a', b: 'b' } }],
];

describe('deepSpreadOptions', () => {
  cases.forEach(([a, b, c, expectedResult]) => {
    it('works just fine', () => {
      const result = deepSpreadOptions(a, b, c);
      expect(result).toEqual(expectedResult);
    });
  });
});
