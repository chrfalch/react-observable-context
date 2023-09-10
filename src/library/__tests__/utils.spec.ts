import { describe, it, expect } from 'vitest';
import { extract, flatten } from '../utils';

describe('utils', () => {
  describe('flatten', () => {
    it('should flatten the resulting object', () => {
      const object = { a: 1, b: 2, c: { d: 'x' } };
      const flat = flatten(object);
      const objectToTest = extract(flat, 'a', 'b', 'c.d');
      expect(objectToTest).toEqual({ a: 1, b: 2, 'c.d': 'x' });
    });

    it('should omit properties not selected', () => {
      const object = { a: 1, b: 2, c: { d: 'x' } };
      const flat = flatten(object);
      const objectToTest = extract(flat, 'a');
      expect(objectToTest).toEqual({ a: 1 });
    });

    it('should remove unmarked props', () => {
      const object = { a: 1, b: 2, c: { d: 'x' } };
      const flat = flatten(object);
      const objectToTest = extract(flat, 'c.d');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(objectToTest.a).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(objectToTest.b).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(objectToTest.c).toBeUndefined();
      expect(objectToTest['c.d']).toEqual('x');
    });

    it('should return nested props', () => {
      const object = { a: 1, b: 2, c: { d: 'x' } };
      const flat = flatten(object);
      const objectToTest = extract(flat, 'c.d');
      expect(objectToTest).toEqual({ 'c.d': 'x' });
    });
  });
});
