import "./styles.css";
import { useState, useEffect } from "react";

export default function App() {

  // use state, manages state of the count variable. setCount is the setter function.
  const [count, setCount] = useState(0);

  // useEffect synchronizes the h1 tag with the count variable.
  useEffect(() => {
    document.querySelector("h1").textContent = `Count: ${count}`
  }, [count]);

  const increment = () => {
    setCount(() => count + 1);
  };

  const decrement = () => {
    setCount(() => count - 1);
  };

  return (
    <>
      <div className="App">
        <h1 style={{ color: "red" }}>Placeholder</h1>
        <h2>Start editing to see some magic happen!</h2>
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </>
  );
}
