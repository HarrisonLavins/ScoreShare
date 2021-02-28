import React, { useState } from 'react';
//import logo from './assets/logo.svg';
import './styles/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

import Navbar from './components/Navbar';
import Score from './components/Score';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '20ch',
    },
  })
);

function App() {
  const classes = useStyles();
  const [outputValue, setOutputValue] = useState('Placeholder...');
  const [renderStrings, setRenderStrings] = useState('C#5/q, C5, C4, G#4');

  const handleEditorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRenderStrings(event.target.value);
  };

  return (
    <div className='App'>
      <Navbar />
      <div className='App-container'>
        <div className={classes.root}>
          <Grid container spacing={8} alignItems='center'>
            <Grid item xs={12}>
              <Score
                scoreID='score1'
                title='My Score'
                subtitle=''
                renderStrings={renderStrings}
                staffClef='treble'
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                className={classes.margin}
                variant='outlined'
              >
                <InputLabel htmlFor='score-editor'>Editor</InputLabel>
                <OutlinedInput
                  id='score-editor'
                  value={renderStrings}
                  onChange={handleEditorChange}
                  startAdornment={
                    <InputAdornment position='start'>
                      <FontAwesomeIcon icon={faMusic} />
                    </InputAdornment>
                  }
                  labelWidth={60}
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default App;
