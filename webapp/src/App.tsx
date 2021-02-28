import React, { useState } from 'react';
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
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '18vw',
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
      width: '10ch',
    },
  })
);

function App() {
  const classes = useStyles();
  const [scoreTitle, setScoreTitle] = useState('My Score');
  const [scoreAuthor, setScoreAuthor] = useState('A. Dimmer');
  const [scoreKey, setScoreKey] = useState('G');
  const [scoreMeter, setScoreMeter] = useState('4/4');
  const [renderString, setRenderString] = useState(
    `|: Gccc dedB | dedB dedB | \nc2ec B2dB | c2A2 A2BA | !mark!c2ec B4:|`
  );

  const parseABCString = (abcString: string) => {
    /* ABC strings take the form: 
        `X:1\nT:${title}\nM:${meter}\nC:${author}\nK:${scoreKey}\n${abcString}`

        for example: 
        `X:1\n
        T:MyScore\n
        M:4/4\n
        C:A. Dimmer\n
        K:G\nc2A2 A2BA`
    */

    return '';
  };

  const handleABCEditorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRenderString(event.target.value);
  };

  const handleTitleEditorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoreTitle(event.target.value);
  };

  const handleAuthorEditorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoreAuthor(event.target.value);
  };

  const handleKeyEditorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoreKey(event.target.value);
  };

  const handleMeterEditorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoreMeter(event.target.value);
  };

  return (
    <div className='App'>
      <Navbar />
      <div className='App-container'>
        <div className={classes.root}>
          <Grid
            container
            spacing={6}
            alignItems='center'
            justify='space-between'
          >
            <Grid item xs={12}>
              <Score
                scoreID='score1'
                title={scoreTitle}
                subtitle=''
                author={scoreAuthor}
                meter={scoreMeter}
                scoreKey={scoreKey}
                abcString={renderString}
                staffClef='treble'
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label='Title'
                id='title-editor'
                className={(classes.margin, classes.textField)}
                onChange={handleTitleEditorChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'></InputAdornment>
                  ),
                }}
                variant='outlined'
                value={scoreTitle}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label='Key'
                id='key-editor'
                className={(classes.margin, classes.textField)}
                onChange={handleKeyEditorChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'></InputAdornment>
                  ),
                }}
                variant='outlined'
                value={scoreKey}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label='Meter'
                id='meter-editor'
                className={(classes.margin, classes.textField)}
                onChange={handleMeterEditorChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'></InputAdornment>
                  ),
                }}
                variant='outlined'
                value={scoreMeter}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label='Author'
                id='author-editor'
                className={(classes.margin, classes.textField)}
                onChange={handleAuthorEditorChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'></InputAdornment>
                  ),
                }}
                variant='outlined'
                value={scoreAuthor}
              />
            </Grid>

            <Grid item xs={11}>
              <FormControl
                fullWidth
                className={classes.margin}
                variant='outlined'
              >
                <InputLabel htmlFor='score-editor'>Editor</InputLabel>
                <OutlinedInput
                  id='score-editor'
                  value={renderString}
                  multiline
                  onChange={handleABCEditorChange}
                  startAdornment={
                    <InputAdornment position='start'>
                      <FontAwesomeIcon icon={faMusic} />
                    </InputAdornment>
                  }
                  labelWidth={60}
                />
              </FormControl>
              {/* <Grid item xs={1}></Grid> */}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default App;
