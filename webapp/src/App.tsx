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
        <Score
          title='My Score'
          subtitle='Score 1'
          renderStrings='C#5/q, C5, C4, G#4[stem="down",id="cursor"]'
        />
      </div>
    </div>
  );
}

export default App;
