import React, { Fragment } from "react";
import Vex from "vexflow";

const Score: React.FunctionComponent = () => {
  const [scoreRenderStrings, setScoreRenderStrings] = React.useState<string>(
    ""
  );

  const renderScore = () => {
    // VexFlow was not designed for react, manually clear the old renders before new render.
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
      scoreElement.innerHTML = "";
      const vf = new Vex.Flow.Factory({
        renderer: { elementId: "score", width: 500, height: 200 },
      });
      const score = vf.EasyScore();
      const system = vf.System();

      system
        .addStave({
          voices: [
            score.voice(
              score.notes("C#5/q, c4, C4, G#4", { stem: "up" }),
              null
            ),
          ],
        })
        .addClef("treble")
        .addTimeSignature("4/4");
      vf.draw();
    } else {
      console.log('No "score" container found!');
    }
  };

  setTimeout(renderScore, 1);

  return <Fragment />;
};

export default Score;
