import {createContext} from './src/createContext';
import {makeObservable} from './src/makeObservable';
import type {NestedKeyOf} from './src/types';
import {useObserver} from './src/useObserver';
import {useObservable} from './src/useObservable';

//***** Default Export *****/
const Better = {
  createContext,
  makeObservable,
  useObserver,
  useObservable,
};

export default Better;

//***** Specific Exports *****/
export {Better, makeObservable, createContext, useObserver, useObservable};
export type {NestedKeyOf};
