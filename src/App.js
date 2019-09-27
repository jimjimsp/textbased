import React from "react";
import InstructionBox from "./components/InstructionBox.js";
import TextBox from "./components/TextBox.js";

function App() {
  return (
    <div className="App">
      <header>
        <h1>A Text Based Game</h1>
        <InstructionBox />
      </header>
      <TextBox />
    </div>
  );
}

export default App;
