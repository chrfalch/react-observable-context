import { vi, describe, it, expect } from 'vitest';
import { makeObservable } from '../makeObservable';

describe('EventBetterContext', () => {
  describe('Reading/Writing', () => {
    it('should make primitive properties readable', () => {
      const ctx = makeObservable({ a: 1, b: 2 });
      expect(ctx.a).toBe(1);
      expect(ctx.b).toBe(2);
    });

    it('should make primitve properties writable', () => {
      const ctx = makeObservable({ a: 1, b: 2 });
      ctx.a = 3;
      ctx.b = 4;
      expect(ctx.a).toBe(3);
      expect(ctx.b).toBe(4);
    });

    it('should make null value properties readable', () => {
      const ctx = makeObservable({ a: null, b: undefined });
      expect(ctx.a).toBe(null);
      expect(ctx.b).toBe(undefined);
    });

    it('should make null value properties writable', () => {
      const ctx = makeObservable<{ a: number | null; b: number | undefined }>({
        a: 1,
        b: 2,
      });
      expect(ctx.a).toBe(1);
      expect(ctx.b).toBe(2);
      ctx.a = null;
      ctx.b = undefined;
      expect(ctx.a).toBe(null);
      expect(ctx.b).toBe(undefined);
    });

    it('should make object properties readable (nested objects)', () => {
      const ctx = makeObservable({ a: 1, b: { c: 2 } });
      expect(ctx.b.c).toBe(2);
    });

    it('should make object properties writable (nested objects)', () => {
      const ctx = makeObservable({ a: 1, b: { c: 2 } });
      ctx.b.c = 3;
      expect(ctx.b.c).toBe(3);
    });

    it('should make array properties readable (nested objects)', () => {
      const ctx = makeObservable({ a: 1, b: [1, 2, 3] });
      expect(ctx.b[1]).toBe(2);
    });

    it('should make array properties writable (nested objects)', () => {
      const ctx = makeObservable({ a: 1, b: [1, 2, 3] });
      ctx.b[1] = 3;
      expect(ctx.b[1]).toBe(3);
    });

    it('should push an array element', () => {
      const ctx = makeObservable({ a: 1, b: [1, 2, 3] });
      ctx.b.push(4);
      expect(ctx.b.length).toBe(4);
    });

    it('should support calling splice on arrays', () => {
      const ctx = makeObservable({ a: 1, b: [1, 2, 3] });
      ctx.b.splice(0, 1);
      expect(ctx.b.length).toBe(2);
    });

    it('should make functions readable', () => {
      const funcA = (a: number) => a * a;
      const ctx = makeObservable({ a: funcA });
      expect(ctx.a).toBe(funcA);
    });

    it('should make functions writable', () => {
      const funcA = (a: number) => a * a;
      const funcB = (a: number) => a + a;
      const ctx = makeObservable({ a: funcA });
      ctx.a = funcB;
      expect(ctx.a).toBe(funcB);
    });
  });
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
  describe('methods', () => {
    it('should allow context to have a method that changes the observable', () => {
      const ctx = makeObservable({
        a: 100,
        increment() {
          this.a += 100;
        },
      });
      ctx.increment();
      expect(ctx.a).toBe(200);
    });

    it('should notify any listeners when value is changed through context method', () => {
      const ctx = makeObservable({
        a: 100,
        increment() {
          this.a += 100;
        },
      });
      const callback = vi.fn();
      ctx.subscribe('a', callback);
      ctx.increment();
      expect(ctx.a).toBe(200);
      expect(callback).toBeCalled();
    });
  });
});
