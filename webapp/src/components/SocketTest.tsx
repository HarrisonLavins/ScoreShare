import { Container, TextField } from "@material-ui/core";
import React from "react";
import { determineEdits } from "../scripts/calculateEditDistance";
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
          const cursor = event.target.selectionEnd
            ? event.target.selectionEnd // After making a change, there is only 1 cursor, so start or end is moot
            : event.target.value.length;
          const editsMade = determineEdits(
            testString,
            event.target.value,
            cursor
          );

          // Developer Debugging
          if (window.location.href.includes("localhost")) {
            console.log(testString);
            console.log(editsMade);
          }

          setTestString(event.target.value);
          sendMessage(event.target.value);
        }}
      />
    </Container>
  );
};

export default SocketTest;
