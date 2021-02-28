import { render } from '@testing-library/react';
import React, { Fragment, FunctionComponent, useState, useEffect } from 'react';
import Vex from 'vexflow';

declare interface ScoreProps {
  scoreID: string;
  subtitle: string;
  title: string;
  renderStrings: string;
  staffClef: string;
}

const Score: FunctionComponent<ScoreProps> = ({
  scoreID,
  subtitle,
  title,
  renderStrings,
  staffClef,
}) => {
  useEffect(() => {
    // code to run after render() goes here
    renderScore();
  }, [renderStrings]); // <--  If one of the dependencies has changed since the last time,
  //the effect will run again. (It will also still run after the initial render)

  const renderScore = () => {
    // VexFlow was not designed for react, manually clear the old renders before new render.
    const scoreElement = document.getElementById(scoreID);
    if (scoreElement) {
      scoreElement.innerHTML = '';
      const vf = new Vex.Flow.Factory({
        renderer: { elementId: scoreID, width: 500, height: 200 },
      });
      const score = vf.EasyScore();
      const system = vf.System();

      try {
        system
          .addStave({
            voices: [
              score.voice(
                score.notes(renderStrings, {
                  stem: 'up',
                  clef: staffClef,
                }),
                null
              ),
            ],
          })
          .addClef(staffClef)
          .addTimeSignature('4/4');
        vf.draw();
      } catch (error) {
        console.log(error);
        scoreElement.innerHTML = `<p>${error.code}: ${error.message}</p>`;
      }
    } else {
      console.log('No "score" container found!');
    }
  };

  return (
    <div className='score'>
      <h2>{title}</h2>
      <div id={scoreID}></div>
      <h3>{subtitle}</h3>
    </div>
  );
};

export default Score;
