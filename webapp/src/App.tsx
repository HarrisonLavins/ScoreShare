import React from "react";
import logo from "./assets/logo.svg";
import "./styles/App.css";

import Navbar from "./components/Navbar";
import SocketTest from "./components/SocketTest";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="App-container">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello world!</p>

        <SocketTest />
      </div>
    </div>
  );
}

export default App;
