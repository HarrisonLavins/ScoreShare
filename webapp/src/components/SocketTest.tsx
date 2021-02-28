import { Container, TextField } from "@material-ui/core";
import React from "react";
import { determineEdits } from "../scripts/calculateEditDistance";
import { openSocket, sendMessage } from "../scripts/socketManager";
import { UpdateFromServer } from "../../../@types";

const SocketTest: React.FunctionComponent = () => {
  const [testString, setTestString] = React.useState<string>("");

  const handleUpdateFromServer = (data: UpdateFromServer) => {
    setTestString(data.score);
  };

  openSocket("test", handleUpdateFromServer);

  return (
    <Container>
      <TextField
        fullWidth
        label="Test Socket"
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
          console.log(testString);
          console.log(editsMade);

          setTestString(event.target.value);
          sendMessage(testString, event.target.value, cursor);
        }}
      />
    </Container>
  );
};

export default SocketTest;
