import logger from "@shared/Logger";
import { Request } from "express";
import * as ws from "ws";

const data: { [key: string]: string | undefined } = {};
const clients: { [key: string]: ws[] | undefined } = {};

const scoreEditorFactory = (ws: ws, req: Request) => {
  const scoreId = req.params.id as string;

  // When the connection is opened
  openConnection(ws, scoreId);

  // Receive a message
  ws.on("message", (message) => handleUpdate(ws, scoreId, message as string));

  // The connection is closed
  ws.on("close", () => closeConnection(ws, scoreId));
};

const openConnection = (ws: ws, scoreId: string) => {
  if (clients[scoreId] === undefined) {
    // Open first connection
    data[scoreId] = ""; // TODO: Get data from the database
    clients[scoreId] = [ws];
  } else {
    // Open additional connection
    clients[scoreId]?.push(ws);
  }

  // Send initial data back to the client
  ws.send(data[scoreId]);

  // Debug logging for the development environment
  debugLogging("Connection opened", scoreId);
};

const handleUpdate = (ws: ws, scoreId: string, scoreData: string) => {
  const clientList = clients[scoreId];

  // Check the connection has not already been closed
  if (clientList) {
    // Store the new data
    data[scoreId] = scoreData;

    // Send the score data to all other users
    for (const client of clientList) {
      if (client !== ws) {
        client.send(scoreData);
      }
    }
  }

  // Debug logging for the development environment
  debugLogging("Message received", scoreId);
};

const closeConnection = (ws: ws, scoreId: string) => {
  const clientList = clients[scoreId];

  // Check the connection has not already been closed
  if (clientList) {
    // Close this connection
    clientList.splice(clientList.indexOf(ws), 1);

    // Check if this was the last connection; if so, close everything
    if (clientList.length === 0) {
      // TODO: Store data in the database
      data[scoreId] = undefined;
      clients[scoreId] = undefined;
    }
  }

  // Debug logging for the development environment
  debugLogging("Connection closed", scoreId);
};

const debugLogging = (eventDescription: string, scoreId: string) => {
  if ((process.env.NODE_ENV = "development")) {
    logger.info(`${eventDescription} for score ${scoreId}`);

    logger.info(`Current state for score ${scoreId}`);
    logger.info(data[scoreId]);
    logger.info(clients[scoreId]);
  }
};
export default scoreEditorFactory;
