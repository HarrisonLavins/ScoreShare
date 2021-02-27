import { render } from '@testing-library/react';
import React, { Fragment, FunctionComponent, useState, useEffect } from 'react';
import Vex from 'vexflow';

declare interface ScoreProps {
  subtitle: string;
  title: string;
  renderStrings: string;
}

const Score: FunctionComponent<ScoreProps> = ({
  subtitle,
  title,
  renderStrings,
}) => {
  const [scoreRenderStrings, setScoreRenderStrings] = useState<string>(
    renderStrings
  );

  useEffect(() => {
    // code to run after render() goes here
    renderScore();
  }, [scoreRenderStrings]); // <--  If one of the dependencies has changed since the last time,
  //the effect will run again. (It will also still run after the initial render)

  const renderScore = () => {
    // VexFlow was not designed for react, manually clear the old renders before new render.
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
      scoreElement.innerHTML = '';
      const vf = new Vex.Flow.Factory({
        renderer: { elementId: 'score', width: 500, height: 200 },
      });
      const score = vf.EasyScore();
      const system = vf.System();

      system
        .addStave({
          voices: [
            score.voice(
              score.notes(scoreRenderStrings, {
                stem: 'up',
              }),
              null
            ),
          ],
        })
        .addClef('treble')
        .addTimeSignature('4/4');
      vf.draw();
    } else {
      console.log('No "score" container found!');
    }
  };

  return (
    <Fragment>
      <h2>{title}</h2>
      <div id='score'></div>
      <h3>{subtitle}</h3>
    </Fragment>
  );
};

export default Score;
