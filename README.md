# React Better Context

React's context is good - but we can do better!

- 🧭 Avoid re-renders of components that provides the context
- 👁️ Use observer based context pattern
- 🖇️ Same API as React's createContext

React Better Context is a replacement for React's createContext method allowing you to create contexts that are observable by the consumers of the context value.

## Example

To explain, let's start with a simple example of how we often see contexts being used in React applications:

```js
type MyContextType = {isPaused: boolean, setIsPaused: (p: boolean) => void};
const MyContext = React.createContext<MyContextType>(undefined);

const PlayPauseBtn = () => {
  const {isPaused, setIsPaused} = React.useContext(MyContext)!;
  return (
    <button onClick={() => setIsPaused(!isPaused)}>
      {isPaused ? 'Play' : 'Pause'}
    </button>
  );
};

const App = () => {
  const [isPaused, setIsPaused] = useState(false);
  const contextValue = useMemo(() => ({isPaused, setIsPaused}), [isPaused]);

  return (
    <MyContext.Provider value={contextValue}>
      <PlayPauseBtn />
    </MyContext.Provider>
  );
};
```

In the above example every time the user clicks the play/pause button, the entire App component and its children will re-render - because we update the `isPaused` state which lives in the root component.

The ideal solution is to prevent the holder of the context to re-render when the context is changed, and only re-render the components that actually use the context. This is what Better Context does.

### Using Better Context

```js
type MyContextType = {isPaused: boolean};
const MyContext = Better.createContext<MyContextType>(undefined);

const PlayPauseBtn = () => {
  const ctx = React.useContext(MyContext)!;
  const [isPaused] = useObserver(ctx, 'isPaused');
  return (
    <button onClick={() => (ctx.isPaused = !ctx.isPaused)}>
      {isPaused ? 'Play' : 'Pause'}
    </button>
  );
};

const App = () => {
  const contextValue = useObservable({isPaused: false});
  return (
    <MyContext.Provider value={contextValue}>
      <PlayPauseBtn />
    </MyContext.Provider>
  );
};
```

Two new concepts has been added to the mix - the `Better.createContext` method and the `useObserver` hook.

## Better.createContext

`Better.createContext` is a replacement for React's createContext method. It accepts the same arguments and returns the same object, but the context object is now observable through the `useObserver` hook. Note that you no longer need a setter function (`setIsPaused`) to update the context object - you can simply update the value directly on the Context object.

## useObserver

The hook `useObserver` observes changes in an observable object. It accepts two arguments - the observable object and a path to the value you want to observe.

You cannot set values with the state returned from `useObserver` - it is read-only. To update the context object, you need to update the value directly on the context object.

To subscribe to changes in a specific slice of the context, you can pass a path to the value you want to observe:

```js
const ctx = React.useContext(MyContext)!;
const {counter} = useObserver(ctx, 'counter');
```

You can also pass multiple values to the `useObserver` hook to observe more than one value:

```js
const ctx = React.useContext(MyContext)!;
const {counter, isPaused} = useObserver(ctx, 'counter', 'isPaused');
```

> 💡 **Tips:**
> Properties in a nested context will often end up with keys containing dots. To destructure such a property you can use the following syntax:
>
> ```js
> const {'my.nested.key': myNestedKey} = useObserver(ctx, 'my.nested.key');
> ```

## useObservable

This hook lets you create a memoized observable object. It accepts an object as an argument and returns an observable object. The returned object is memoized, so it will only be re-created when the object passed to the hook changes.

The initial value will only be read once - the hook does not update the observable if the initial value changes.

```js
// Context value will be a memoized observable object
const contextValue = useObservable({isPaused: false});
```
