import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@material-ui/core";
import { nanoid } from "nanoid";
import React, { Fragment } from "react";
import Editor from "./components/Editor";
import Navbar from "./components/Navbar";
import SocketTest from "./components/SocketTest";
import "./styles/App.css";

const App: React.FunctionComponent = () => {
  const [scoreId, setScoreId] = React.useState("");
  const [tempScoreId, setTempScoreId] = React.useState("");
  const [scoreIdSelect, setScoreIdSelect] = React.useState(false);
  const [debuggerOpen, setDebuggerOpen] = React.useState(false);

  return (
    <Fragment>
      <Navbar />
      {scoreId === "" && (
        <Container>
          <Grid container alignItems="center" alignContent="center" spacing={4}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setScoreId(nanoid())}
                fullWidth
                size="large"
              >
                Start New Session
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setScoreIdSelect(true)}
                fullWidth
                size="large"
              >
                Connect to Existing Session
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setDebuggerOpen(!debuggerOpen)}
                fullWidth
                size="large"
              >
                Toggle Developer Websocket Debugger
              </Button>
            </Grid>
          </Grid>
        </Container>
      )}
      {scoreId !== "" && (
        <Fragment>
          <Editor scoreId={scoreId} />
          <Container style={{ width: "25%" }}>
            <Grid
              container
              alignItems="center"
              alignContent="center"
              spacing={4}
            >
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setScoreId("")}
                  fullWidth
                >
                  Close Editor
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Fragment>
      )}

      {debuggerOpen && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <SocketTest />
          </Grid>
        </Grid>
      )}

      <Dialog
        open={scoreIdSelect}
        onClose={() => setScoreIdSelect(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Share this ScoreId to add collaborators
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={tempScoreId}
            onChange={(event) => setTempScoreId(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScoreIdSelect(false)} color="primary">
            Close
          </Button>
          <Button
            onClick={() => {
              setScoreId(tempScoreId);
              setScoreIdSelect(false);
            }}
            color="primary"
          >
            Join Session
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default App;
