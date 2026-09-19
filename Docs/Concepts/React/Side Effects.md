# React Side Effects — Discussion

## What are React side effects?

In **React**, side effects refer to operations that occur **after rendering** and interact with the outside world, rather than directly impacting the current render cycle. These actions are considered **impure** because they affect something outside the scope of the function being executed.

Common examples:
- **Data fetching:** Making asynchronous requests to an API or server.
- **DOM manipulation:** Manually changing the DOM.
- **Subscriptions:** Setting up event listeners or WebSocket connections.
- **Web APIs:** Interacting with browser APIs like `localStorage`.

React components are designed to be **pure functions** for rendering UI, so side effects must be handled separately using the **`useEffect` hook**.

---

## Definition of `useEffect`

**`useEffect`** is a React Hook that lets you **synchronize a component with an external system** — anything outside React's rendering pipeline.

```js
useEffect(setup, dependencies?)   