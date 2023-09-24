import { describe, it, expect, expectTypeOf } from 'vitest';
import { extract, flatten } from '../utils';

describe('utils', () => {
  describe('flatten', () => {
    it('should flatten the resulting object', () => {
      const object = { a: 1, b: 2, c: { d: 'x' } };
      const objectToTest = flatten(object);
      expect(objectToTest).toEqual({ a: 1, b: 2, 'c.d': 'x' });
    });

    it('should create the correct type for the flattenend object', () => {
      const object = { a: 1, b: 2, c: { d: 'x' } };
      const objectToTest = flatten(object);
      expectTypeOf(objectToTest).toEqualTypeOf<{
        a: number;
        b: number;
        'c.d': string;
      }>();
    });

    it('should flatten arrays correctly', () => {
      const object = { a: 1, c: [0, 1] };
      const objectToTest = flatten(object);
      expect(objectToTest).toEqual({
        a: 1,
        'c.length': 2,
        'c.0': 0,
        'c.1': 1,
        c: [0, 1],
      });
    });
  });
  describe('extract', () => {
    it('should flatten the resulting object', () => {
      const object = { a: 1, b: 2, c: { d: 'x' } };
      const flat = flatten(object);
      const objectToTest = extract(flat, 'a', 'b', 'c.d');
      expect(objectToTest).toEqual({ a: 1, b: 2, 'c.d': 'x' });
    });

    it('should create the correct type for the extracted object', () => {
      const object = { a: 1, b: 2, c: { d: 'x' } };
      const flat = flatten(object);
      const objectToTest = extract(flat, 'a', 'c.d');
      expectTypeOf(objectToTest).toEqualTypeOf<{
        a: number;
        'c.d': string;
      }>();
    });

    it('should omit properties not selected', () => {
      const object = { a: 1, b: 2, c: { d: 'x' } };
      const flat = flatten(object);
      const objectToTest = extract(flat, 'a');
      expect(objectToTest).toEqual({ a: 1 });
      expect(Object.keys(objectToTest).length).toBe(1);
    });

    it('should return nested props', () => {
      const object = { a: 1, b: 2, c: { d: 'x' } };
      const flat = flatten(object);
      const objectToTest = extract(flat, 'c.d');
      expect(objectToTest).toEqual({ 'c.d': 'x' });
    });

    it('should return array as full array', () => {
      const object = { a: [0, 1] };
      const flat = flatten(object);
      const objectToTest = extract(flat, 'a');
      expect(objectToTest).toEqual({
        a: [0, 1],
      });
    });

    it('should return array.length', () => {
      const object = { a: [0, 1] };
      const flat = flatten(object);
      const objectToTest = extract(flat, 'a.length');
      expect(objectToTest).toEqual({
        'a.length': 2,
      });
    });

    it('should return array by index', () => {
      const object = { a: [0, 1] };
      const flat = flatten(object);
      const objectToTest = extract(flat, 'a.1');
      expect(objectToTest).toEqual({
        'a.1': 1,
      });
    });
  });
});
