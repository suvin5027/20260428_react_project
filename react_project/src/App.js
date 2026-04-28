import React, { useState } from 'react';
import './App.scss';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="header">
        <h1>React Project Study</h1>
        <p>Counter: {count}</p>

        <button
          className="btn-primary"
          onClick={() => setCount(count + 1)}
        >
          Increase
        </button>
      </header>
    </div>
  );
}

export default App;