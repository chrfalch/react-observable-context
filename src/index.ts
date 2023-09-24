import { createContext } from './library/createContext';
import { makeObservable } from './library/makeObservable';
import type { FlattenedKeysOf } from './library/types';
import { useObserver } from './library/useObserver';
import { useObservable } from './library/useObservable';

//***** Default Export *****/
const Observable = {
  createContext,
  makeObservable,
  useObserver,
  useObservable,
};

export default Observable;

//***** Explicit Exports *****/
export {
  Observable,
  makeObservable,
  createContext,
  useObserver,
  useObservable,
};
export type { FlattenedKeysOf };
