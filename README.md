# React Observable Context

React's context is good - but we can do better!

- 🧭 Avoid re-renders of root components with contexts
- 👁️ Use observer based patterns to subscribe to changes in context
- 👯‍♂️ Provides the same API as React's createContext

React Observable Context is a replacement for React's createContext method allowing you to create contexts that are directly mutable with subscriber support.

## Example

Let's dive right in with a simple example of how to use React Observable Context:

```js
import React from 'react';
import {
  createContext,
  useObserver,
} from '@chrfalch/react-observable-context';

// Let's declare our context - let's use our implementation of createContext:
const MyContext = createContext({
  counter: 0,
});

// Create a component using the context's value
const CurrentCount = () => {
  const context = React.useContext(MyContext);
  const { counter } = useObserver(context, 'counter');
  return <div>{counter}</div>;
};

// Create the app component that also uses the context
const App = () => {
  // Remember that per React documentation you can use a context without a provider
  // but you will get the default value - which is a valid object in this example.
  return (
    <div>
      <CurrentCount />
      <button title="Inc" onClick={() => MyContext.counter++}>
    </div>
  );
};
```

## createContext

`createContext` is a replacement for React's createContext method. It accepts the same arguments and returns the same type, but the resulting context object is observable through the `useObserver` hook.

> 💡 You don't need a setter function (`setCounter` or `increment`) to update the context object - you can simply update the value directly on the Context object.

## useObserver

The hook `useObserver` observes changes in an observable object. It accepts two arguments - the observable object and a path to the value you want to observe.

To subscribe to changes in a specific slice of the context, you can pass a path to the value you want to observe:

```js
const ctx = React.useContext(MyContext)!;
const {counter} = useObserver(ctx, 'counter');
```

> 💡 You cannot set values with the state returned from `useObserver` - it is read-only. To update the context object, you need to update the value directly on the context object.

You can also pass multiple values to the `useObserver` hook to observe more than one value:

```js
const ctx = React.useContext(MyContext)!;
const {counter, isPaused} = useObserver(ctx, 'counter', 'isPaused');
```

> 💡 **Tips:**
> Properties in a nested context will often end up with keys containing dots. To destructure such a property you can use the following syntax:
>
> ```js
> const { 'my.nested.key': myNestedKey } = useObserver(ctx, 'my.nested.key');
> ```

## useObservable

This hook lets you create a memoized observable object. It accepts an object as an argument and returns an observable object. The returned object is memoized, so it will only be re-created when the object passed to the hook changes.

The initial value will only be read once - the hook does not update the observable if the initial value changes.

This hook is typically used to create the context object with a specific value when using a Context Provider:

```js
// Context value will be a memoized observable object
const contextValue = useObservable({ counter: 1 });
return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
```
