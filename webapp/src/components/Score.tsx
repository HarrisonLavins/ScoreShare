import Vex from 'vexflow';

import React, { Component } from 'react';

class Score extends Component {
        state = {
            vf: null,
            score: null,
            system: null
        }

    componentDidMount() {
        const vf = new Vex.Flow.Factory({renderer: {elementId: 'score', width: 500, height: 200}});
        const score = vf.EasyScore();
        const system = vf.System();

        this.setState({vf: vf, score: score, system: system});

          
        system.addStave({
            voices: [
              score.voice(score.notes('C#5/q, c4, C4, G#4', {stem: 'up'}), null)           
            ]
        }).addClef('treble').addTimeSignature('4/4');
        vf.draw();
    }

    render() {
        return (
            <p>Score Viewer</p>
        );
    }
}

export default Score;
