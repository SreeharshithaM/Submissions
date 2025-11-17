// src/ApiButton2.js
import React, { useState } from "react";

export default function ApiButton2() {
  const [data, setData] = useState(null);

  const callApi = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const result = await response.json();
      setData(result);
    } catch (error) {
      setData({ error: "API Error" });
    }
  };

  return (
    <div>
      <button data-testid="btn2" onClick={callApi}>
        Fetch User 1
      </button>

      {data && <pre data-testid="result2">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
