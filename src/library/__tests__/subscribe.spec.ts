import { vi, describe, it, expect } from 'vitest';
import { makeObservable } from '../makeObservable';

describe('makeObservable', () => {
  describe('Subscribing', () => {
    it('should be possible to subscribe to a primitive write operation', () => {
      const ctx = makeObservable({ a: 1, b: 2 });
      const callback = vi.fn();
      ctx.subscribe('a', callback);
      ctx.a = 3;
      expect(callback).toBeCalledTimes(1);
    });

    it('should be possible to subscribe to an object property write operation', () => {
      const ctx = makeObservable({ a: 1, b: { c: 10 } });
      const callback = vi.fn();
      ctx.subscribe('b.c', callback);
      ctx.b.c = 3;
      expect(callback).toBeCalledTimes(1);
    });

    it('should be possible to subscribe to a function property write operation', () => {
      const funcA = (a: number) => a * a;
      const funcB = (a: number) => a + a;
      const ctx = makeObservable({ a: funcA });
      const callback = vi.fn();
      ctx.subscribe('a', callback);
      ctx.a = funcB;
      expect(callback).toBeCalled();
    });

    it('should be possible to subscribe to an array property write operation', () => {
      const ctx = makeObservable({ a: 1, b: [1, 2, 3] });
      const callback = vi.fn();
      ctx.subscribe('b.1', callback);
      ctx.b[1] = 3;
      expect(callback).toBeCalledTimes(1);
    });

    it('should be possible to subscribe to changes in an array when pushing an element', () => {
      const ctx = makeObservable({ a: 1, b: [1, 2, 3] });
      const callback = vi.fn();
      ctx.subscribe('b', callback);
      ctx.b.push(10);
      expect(callback).toBeCalled();
    });

    it('should be possible to subscribe to changes in an array when removing an element', () => {
      const ctx = makeObservable({ a: 1, b: [1, 2, 3] });
      const callback = vi.fn();
      ctx.subscribe('b', callback);
      ctx.b.splice(0, 1);
      expect(callback).toBeCalled();
    });

    it('should be possible to subscribe to changes in an array when filling elements', () => {
      const ctx = makeObservable({ a: 1, b: [1, 2, 3] });
      const callback = vi.fn();
      ctx.subscribe('b', callback);
      ctx.b.fill(10);
      expect(callback).toBeCalled();
    });

    it('should be possible to subscribe to changes in an array using the root object property path', () => {
      const ctx = makeObservable({ a: 1, b: [1, 2, 3] });
      const callback = vi.fn();
      ctx.subscribe('b', callback);
      ctx.b[2] = 10;
      expect(callback).toBeCalled();
    });

    it('should be possible to subscribe to changes in an object using the root object property path', () => {
      const ctx = makeObservable({ a: 1, b: { c: 100 } });
      const callback = vi.fn();
      ctx.subscribe('b', callback);
      ctx.b.c = 10;
      expect(callback).toBeCalled();
    });
  });
});
