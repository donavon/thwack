import deepSpreadOptions from '../src/core/utils/deepSpreadOptions';

const cases = [
  [undefined, undefined, {}],
  [{ a: 'b' }, { a: 'c' }, { a: 'c' }],
  [undefined, { a: 'c' }, { a: 'c' }],
  [{ a: 'b' }, undefined, { a: 'b' }],
  [{ b: 'b' }, { c: 'c' }, { b: 'b', c: 'c' }],
  [{ a: { a: 'a' } }, { a: 'b' }, { a: 'b' }],
  [{ a: 'b' }, { a: { a: 'c' } }, { a: { 0: 'b', a: 'c' } }],
  [{ a: { a: 'b' } }, { a: { a: 'c' } }, { a: { a: 'c' } }],
  [{ a: { a: 'b' } }, {}, { a: { a: 'b' } }],
  [{ a: { a: 'a' } }, { a: { b: 'b' } }, { a: { a: 'a', b: 'b' } }],
];

describe('deepSpreadOptions', () => {
  cases.forEach(([a, b, expectedResult], idx) => {
    it(`works just fine - ${idx}`, () => {
      const result = deepSpreadOptions(a, b);
      expect(result).toEqual(expectedResult);
    });
  });
});
