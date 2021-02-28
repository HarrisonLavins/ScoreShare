import React, { FunctionComponent, useEffect } from "react";
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
