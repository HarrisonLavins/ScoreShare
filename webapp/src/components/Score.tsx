import { render } from '@testing-library/react';
import React, { Fragment, FunctionComponent, useState, useEffect } from 'react';
// @ts-ignore
import Abcjs from 'react-abcjs';

declare interface ScoreProps {
  scoreID: string;
  subtitle: string;
  title: string;
  author: string;
  scoreKey: string;
  meter: string;
  abcString: string;
  staffClef: string;
}

const Score: FunctionComponent<ScoreProps> = ({
  scoreID,
  subtitle,
  title,
  scoreKey,
  meter,
  abcString,
  author,
  staffClef,
}) => {
  useEffect(() => {
    // code to run after render() goes here
    renderScore();
  }, [abcString]); // <--  If one of the dependencies has changed since the last time,
  //the effect will run again. (It will also still run after the initial render)

  const renderScore = () => {
    const scoreElement = document.getElementById(scoreID);
    if (scoreElement) {
      // scoreElement.innerHTML = '';
    } else {
      console.log('No "score" container found!');
    }
  };

  return (
    <div className='score'>
      {/* <h2>{title}</h2> */}
      <div id={scoreID} style={{ maxWidth: '90vw' }}>
        <Abcjs
          abcNotation={`X:1\nT:${title}\nM:${meter}\nC:${author}\nK:${scoreKey}\n${abcString}`}
          parserParams={{}}
          engraverParams={{}}
          renderParams={{ viewportHorizontal: true }}
        />
      </div>
      <h3>{subtitle}</h3>
    </div>
  );
};

export default Score;
