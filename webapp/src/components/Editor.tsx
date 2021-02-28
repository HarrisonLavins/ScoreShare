import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import TextField from "@material-ui/core/TextField";
import React, { Fragment } from "react";
import { UpdateFromServer } from "../../../@types";
import { openSocket, sendMessage } from "../scripts/socketManager";
import "../styles/App.css";
import Score from "./Score";

declare interface EditorProps {
  scoreId: string;
}

const Editor: React.FunctionComponent<EditorProps> = ({ scoreId }) => {
  const [scoreTitle, setScoreTitle] = React.useState("");
  const [scoreAuthor, setScoreAuthor] = React.useState("");
  const [scoreKey, setScoreKey] = React.useState("");
  const [scoreMeter, setScoreMeter] = React.useState("");
  const [scoreString, setScoreString] = React.useState("");
  const [importExportOpen, setImportExportOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);

  const handleUpdateFromServer = (data: UpdateFromServer) => {
    fromAbcString(data.score);
  };

  const updateAbcString = (
    scoreTitle: string,
    scoreMeter: string,
    scoreAuthor: string,
    scoreKey: string,
    scoreString: string
  ) => {
    const newAbcString = toAbcString(
      scoreTitle,
      scoreMeter,
      scoreAuthor,
      scoreKey,
      scoreString
    );
    sendMessage(abcString, newAbcString, 0);
    setAbcString(newAbcString);
  };

  openSocket("test", handleUpdateFromServer);

  const fromAbcString = (abcString: string) => {
    const abcArray = abcString.split("\n");
    const scoreArray = [];
    const details = {
      title: "",
      meter: "",
      author: "",
      key: "",
    };
    for (const line of abcArray) {
      const value = line.substr(line.indexOf(":") + 1).trim();
      if (line.charAt(0) === "X") {
        // Do nothing?
      } else if (line.charAt(0) === "T") {
        details.title = value;
      } else if (line.charAt(0) === "M") {
        details.meter = value;
      } else if (line.charAt(0) === "C") {
        details.author = value;
      } else if (line.charAt(0) === "K") {
        details.key = value;
      } else {
        scoreArray.push(line);
      }
    }

    setScoreTitle(details.title);
    setScoreAuthor(details.author);
    setScoreMeter(details.meter);
    setScoreKey(details.key);
    setScoreString(scoreArray.join("\n"));
  };

  const toAbcString = (
    scoreTitle: string,
    scoreMeter: string,
    scoreAuthor: string,
    scoreKey: string,
    scoreString: string
  ) => {
    return `X:1\nT:${scoreTitle}\nM:${scoreMeter}\nC:${scoreAuthor}\nK:${scoreKey}\n${scoreString}`;
  };

  const [abcString, setAbcString] = React.useState(
    toAbcString(scoreTitle, scoreMeter, scoreAuthor, scoreKey, scoreString)
  );

  const handleABCEditorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoreString(event.target.value);
    updateAbcString(
      scoreTitle,
      scoreMeter,
      scoreAuthor,
      scoreKey,
      event.target.value
    );
  };

  const handleTitleEditorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoreTitle(event.target.value);
    updateAbcString(
      event.target.value,
      scoreMeter,
      scoreAuthor,
      scoreKey,
      scoreString
    );
  };

  const handleAuthorEditorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoreAuthor(event.target.value);
    updateAbcString(
      scoreTitle,
      scoreMeter,
      event.target.value,
      scoreKey,
      scoreString
    );
  };

  const handleKeyEditorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoreKey(event.target.value);
    updateAbcString(
      scoreTitle,
      scoreMeter,
      scoreAuthor,
      event.target.value,
      scoreString
    );
  };

  const handleMeterEditorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScoreMeter(event.target.value);
    updateAbcString(
      scoreTitle,
      event.target.value,
      scoreAuthor,
      scoreKey,
      scoreString
    );
  };

  return (
    <Fragment>
      <Container>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <Paper>
              <Score
                scoreID="score1"
                subtitle=""
                abcString={toAbcString(
                  scoreTitle,
                  scoreMeter,
                  scoreAuthor,
                  scoreKey,
                  scoreString
                )}
                staffClef="treble"
              />
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Title"
              id="title-editor"
              onChange={handleTitleEditorChange}
              variant="outlined"
              value={scoreTitle}
              fullWidth
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Key"
              id="key-editor"
              onChange={handleKeyEditorChange}
              variant="outlined"
              value={scoreKey}
              fullWidth
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Meter"
              id="meter-editor"
              onChange={handleMeterEditorChange}
              variant="outlined"
              value={scoreMeter}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Author"
              id="author-editor"
              onChange={handleAuthorEditorChange}
              variant="outlined"
              value={scoreAuthor}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              color="primary"
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => {
                setAbcString("");
                setImportExportOpen(true);
              }}
            >
              Import/Export
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              onClick={() => {
                setShareOpen(true);
              }}
            >
              Share
            </Button>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="score-editor">Editor</InputLabel>
              <OutlinedInput
                id="score-editor"
                value={scoreString}
                fullWidth
                multiline
                onChange={handleABCEditorChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faMusic} />
                  </InputAdornment>
                }
                labelWidth={60}
              />
            </FormControl>
            {/* <Grid item xs={1}></Grid> */}
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={importExportOpen}
        onClose={() => setImportExportOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Import/Export as ABC Notation
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            value={abcString}
            onChange={(event) => {
              setAbcString(event.target.value);
              sendMessage(abcString, event.target.value, 0);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setImportExportOpen(false);
            }}
            color="primary"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setImportExportOpen(false);
              fromAbcString(abcString);
            }}
            color="primary"
          >
            Import
          </Button>
          <Button
            onClick={() => {
              // setImportExportOpen(false);
              setAbcString(
                toAbcString(
                  scoreTitle,
                  scoreMeter,
                  scoreAuthor,
                  scoreKey,
                  scoreString
                )
              );
            }}
            color="primary"
            autoFocus
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Share this ScoreId to add collaborators
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth disabled value={scoreId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default Editor;
