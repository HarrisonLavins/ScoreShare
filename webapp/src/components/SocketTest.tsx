import { Container, TextField } from "@material-ui/core";
import React from "react";
import { openSocket, sendMessage } from "../scripts/socketManager";

const SocketTest: React.FunctionComponent = () => {
  const [testString, setTestString] = React.useState<string>("");

  openSocket("test", setTestString);

  return (
    <Container>
      <TextField
        fullWidth
        variant="outlined"
        value={testString}
        onChange={(event) => {
          setTestString(event.target.value);
          sendMessage(event.target.value);
        }}
      />
    </Container>
  );
};

export default SocketTest;
