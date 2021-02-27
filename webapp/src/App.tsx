import React from 'react';
//import logo from './assets/logo.svg';
import './styles/App.css';

import Navbar from './components/Navbar';
import Score from './components/Score';

function App() {
  return (
    <div className='App'>
      <Navbar />
      <div className='App-container'>
        <Score name='Name here' title='title here' />
      </div>
    </div>
  );
}

export default App;
