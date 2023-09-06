import React from 'react';
import {makeObservable} from './makeObservable';

/**
 * Creates a new React Context with the provided object as the initial value.
 * The context will support subscribing to changes and notifications when the value changes.
 * @param obj
 * @returns
 */
export const createContext = <T>(obj: T) =>
  React.createContext(obj ? makeObservable(obj) : undefined);
