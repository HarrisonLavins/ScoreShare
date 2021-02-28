import React, { Fragment } from "react";
import Editor from "./components/Editor";
import Navbar from "./components/Navbar";
import "./styles/App.css";

const App: React.FunctionComponent = () => {
  const [scoreId, setScoreId] = useState("");

  return (
    <Fragment>
      <Navbar />
      {/* scoreId && */ <Editor scoreId={scoreId} />}
    </Fragment>
  );
};

export default App;
