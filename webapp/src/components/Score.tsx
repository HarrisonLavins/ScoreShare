import { render } from "@testing-library/react";
import React, { Fragment, FunctionComponent, useState, useEffect } from "react";
// @ts-ignore
import Abcjs from "react-abcjs";
// import abcjs from "abcjs";

declare interface ScoreProps {
  scoreID: string;
  subtitle: string;
  abcString: string;
  staffClef: string;
}

const Score: FunctionComponent<ScoreProps> = ({
  scoreID,
  subtitle,
  abcString,
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
      // Do nothing
    } else {
      console.log('No "score" container found!');
    }
  };

  return (
    <div className="score">
      {/* <h2>{title}</h2> */}
      <Abcjs
        abcNotation={abcString}
        parserParams={{}}
        engraverParams={{}}
        renderParams={{ viewportHorizontal: false }}
      />
      <h3>{subtitle}</h3>
    </div>
  );
};

export default Score;
