import { FlattenedKeysOf, FlattenedObjectOf } from './types';

type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T
  ? 1
  : 2) extends <G>() => G extends U ? 1 : 2
  ? Y
  : N;

declare const exactType: <T, U>(
  draft: T & IfEquals<T, U>,
  expected: U & IfEquals<T, U>
) => IfEquals<T, U>;

type MockType = {
  a: number;
  b: number;
  c: { d: string };
  e: Array<string>;
  f: Array<{ g: string; h: number }>;
  i: (a: number) => string;
};

// Tests - FlattenedKeysOf
type ExpectedFlattenedKeysOf = FlattenedKeysOf<MockType>;
declare let expected_1: ExpectedFlattenedKeysOf;
declare let received_1:
  | 'a'
  | 'b'
  | 'e'
  | 'f'
  | 'c.d'
  | `e.${number}`
  | 'e.length'
  | 'f.length'
  | `f.${number}.g`
  | `f.${number}.h`
  | 'i';

// @ts-expect-no-error
exactType(expected_1, received_1);

// Tests - FlattenedObjectOf
type ExpectedFlattenedObjectOf = FlattenedObjectOf<MockType>;
declare let expected_2: ExpectedFlattenedObjectOf;
declare let received_2: {
  [x: `e.${number}`]: string;
  [x: `f.${number}.g`]: string;
  [x: `f.${number}.h`]: number;
  a: number;
  b: number;
  'c.d': string;
  'e.length': number;
  'f.length': number;
  e: Array<string>;
  f: Array<{ g: string; h: number }>;
  i: (a: number) => string;
};
// eslint-disable-next-line prefer-const
received_2 = {
  a: 10,
  b: 2,
  'c.d': 'Hello',
  'e.length': 1,
  'e.0': '10',
  'f.length': 1,
  'f.0.g': 'Hello',
  'f.0.h': 10,
  f: [{ g: 'Hello', h: 10 }],
  e: ['10'],
  i: (a: number) => a.toString(),
};
// @ts-expect-no-error
exactType(expected_2, received_2);
