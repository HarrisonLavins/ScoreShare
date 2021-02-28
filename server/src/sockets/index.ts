import { Express } from "express";
import expressWs from "express-ws";
import scoreEditor from "./ScoreEditor";

const initSockets = (app: Express, endpoint: string) => {
  const wsInstance = expressWs(app);
  wsInstance.app.ws(`${endpoint}/:id`, scoreEditor);
};

export default initSockets;
