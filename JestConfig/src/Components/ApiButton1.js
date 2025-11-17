// src/ApiButton1.js
import React, { useState } from "react";

export default function ApiButton1() {
  const [data, setData] = useState(null);

  const callApi = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
      const result = await response.json();
      setData(result);
    } catch (error) {
      setData({ error: "API Error" });
    }
  };

  return (
    <div>
      <button data-testid="btn1" onClick={callApi}>
        Fetch Post 1
      </button>

      {data && <pre data-testid="result1">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
