import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  const doubleNumber = (num) => num * 2;   // logic for tests

  return (
    <div>
      <h1>Welcome to first-app</h1>

      <p data-testid="count-value">Count: {count}</p>

      <button data-testid="increase-btn" onClick={() => setCount(count + 1)}>
        Increment
      </button>

      <button data-testid="double-btn" onClick={() => setCount(doubleNumber(count))}>
        Double Count
      </button>

      <a href="https://reactjs.org">Learn React</a>
    </div>
  );
}
