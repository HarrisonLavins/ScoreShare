import logger from "@shared/Logger";
import { Request } from "express";
import { nanoid } from "nanoid";
import { determineEdits } from "src/scripts/calculateEditDistance";
import * as ws from "ws";
import {
  ClientCursorPositions,
  EditToServerUpdate,
  UpdateFromServer,
} from "../../../@types";

const data: {
  [key: string]:
    | {
        baseScore: string;
        mergedScore: string[];
        edits: EditToServerUpdate[];
        cursors: ClientCursorPositions[];
      }
    | undefined;
} = {};
const clients: {
  [key: string]: { connectionId: string; ws: ws }[] | undefined;
} = {};

const scoreEditorFactory = (ws: ws, req: Request) => {
  const scoreId = req.params.id as string;
  const myConnection = { connectionId: nanoid(), ws };

  // When the connection is opened
  openConnection(myConnection, scoreId);

  // Receive a message
  ws.on("message", (message) =>
    receiveUpdate(myConnection, scoreId, message as string)
  );

  // The connection is closed
  ws.on("close", () => closeConnection(myConnection, scoreId));
};

const openConnection = (
  myConnection: { connectionId: string; ws: ws },
  scoreId: string
) => {
  if (clients[scoreId] === undefined) {
    // Open first connection
    data[scoreId] = { baseScore: "", mergedScore: [], edits: [], cursors: [] }; // TODO: Get data from the database
    clients[scoreId] = [];
  }

  clients[scoreId]?.push(myConnection);

  // Send initial data back to the client
  sendUpdate(myConnection, scoreId);

  // Debug logging for the development environment
  debugLogging("Connection opened", scoreId);
};

const receiveUpdate = (
  myConnection: { connectionId: string; ws: ws },
  scoreId: string,
  update: string
) => {
  const clientList = clients[scoreId];

  // Check the connection has not already been closed
  if (clientList) {
    // Parse update data
    const updateData = JSON.parse(update) as EditToServerUpdate;

    // Insert the new update
    mergeNewEdit(updateData, scoreId);

    // Send the score data to all other users
    for (const connection of clientList) {
      sendUpdate(connection, scoreId);
    }
  }

  // Debug logging for the development environment
  debugLogging("Message received", scoreId);
};

const mergeNewEdit = (edit: EditToServerUpdate, scoreId: string) => {
  const scoreData = data[scoreId];

  // Check the connection has not already been closed
  if (scoreData) {
    // Find the right time to insert the new edit
    let insertAfterIndex = scoreData.edits.length - 1;
    while (
      insertAfterIndex >= 0 &&
      edit.editTime < scoreData.edits[insertAfterIndex].editTime
    ) {
      insertAfterIndex--;
    }

    // Insert the edit and associated placeholder values
    scoreData.edits.splice(insertAfterIndex + 1, 0, edit);
    scoreData.cursors.splice(insertAfterIndex + 1, 0, {});
    scoreData.mergedScore.splice(insertAfterIndex + 1, 0, "");

    // Propigate Edits
    for (let i = insertAfterIndex + 1; i < scoreData.edits.length; i++) {
      // Configure past data (catches edge case of inserting right at the beginning)
      const currentEdit = scoreData.edits[i];
      const pastCursors = i > 0 ? scoreData.cursors[i - 1] : {};
      const pastMergedScore =
        i > 0 ? scoreData.mergedScore[i - 1] : scoreData.baseScore;

      // Edits in order, no need for recursion, can just apply
      if (currentEdit.original === pastMergedScore) {
        scoreData.mergedScore[i] = currentEdit.updated;
        const currentCursors = copyOtherCursors(
          pastCursors,
          currentEdit.connectionId
        );
        currentCursors[currentEdit.connectionId] = currentEdit.cursor;
      } else {
        // TODO: FIX THIS LOGIC, there are still some failing edge cases
        // Find the current edit difference and patch any hole (ex. "I I", "D D", etc.)
        const currentEditDiffArray = determineEdits(
          currentEdit.original,
          currentEdit.updated,
          currentEdit.cursor
        ).split("");

        const lowerEditBound = Math.min(
          currentEditDiffArray.indexOf("I") > 0
            ? currentEditDiffArray.indexOf("I")
            : Infinity,
          currentEditDiffArray.indexOf("D") > 0
            ? currentEditDiffArray.indexOf("D")
            : Infinity,
          currentEditDiffArray.indexOf("R") > 0
            ? currentEditDiffArray.indexOf("R")
            : Infinity
        );
        const upperEditBound = Math.max(
          currentEditDiffArray.lastIndexOf("I"),
          currentEditDiffArray.lastIndexOf("D"),
          currentEditDiffArray.lastIndexOf("R")
        );

        for (let i = lowerEditBound; i < upperEditBound; i++) {
          if (currentEditDiffArray[i] === " ") {
            currentEditDiffArray[i] = "R";
          }
        }

        const currentEditDiff = currentEditDiffArray.join();

        logger.info(currentEditDiff);

        // Find the section to delete and the section to insert
        const keyPoints: { [key: string]: number } = {
          startDeleteIndex: Math.min(
            currentEditDiffArray.indexOf("D") > 0
              ? currentEditDiffArray.indexOf("D")
              : Infinity,
            currentEditDiffArray.indexOf("R") > 0
              ? currentEditDiffArray.indexOf("R")
              : Infinity
          ),
          startInsertIndex: Math.min(
            currentEditDiffArray.indexOf("I") > 0
              ? currentEditDiffArray.indexOf("I")
              : Infinity,
            currentEditDiffArray.indexOf("R") > 0
              ? currentEditDiffArray.indexOf("R")
              : Infinity
          ),
          stopDeleteIndex: Math.max(
            currentEditDiffArray.lastIndexOf("D"),
            currentEditDiffArray.lastIndexOf("R")
          ),
          stopInsertIndex: Math.max(
            currentEditDiffArray.lastIndexOf("I"),
            currentEditDiffArray.lastIndexOf("R")
          ),
          cursor: currentEdit.cursor,
        };

        // Get insertion string
        const insertionString =
          keyPoints.startInsertIndex <= keyPoints.stopInsertIndex
            ? currentEdit.updated.substring(
                keyPoints.startInsertIndex,
                keyPoints.stopInsertIndex + 1
              )
            : "";

        // Find past edit difference; note cursor position does not matter --> check this!
        const pastEditDiff = determineEdits(
          currentEdit.original,
          pastMergedScore,
          100
        ).split("");

        logger.info("Past Diff: " + pastEditDiff.join());

        // Adjust indecies based on changes that occurred before
        for (let i = 0; i < pastEditDiff.length; i++) {
          for (const key in keyPoints) {
            if (pastEditDiff[i] === "I" && keyPoints[key] < i) {
              keyPoints[key]++;
            } else if (pastEditDiff[i] === "D" && keyPoints[key] < i) {
              keyPoints[key]--;
            }
          }
        }

        // Get delete length
        const deleteLength =
          keyPoints.startDeleteIndex <= keyPoints.stopDeleteIndex
            ? keyPoints.stopDeleteIndex - keyPoints.startDeleteIndex + 1
            : 0;

        // Get edit start point
        const editStartPoint = Math.min(
          keyPoints.startDeleteIndex > 0
            ? keyPoints.startDeleteIndex
            : Infinity,
          keyPoints.startInsertIndex > 0 ? keyPoints.startInsertIndex : Infinity
        );

        // Make new edits
        logger.info(pastMergedScore.substring(0, editStartPoint));
        logger.info(insertionString);
        logger.info(pastMergedScore.substr(editStartPoint + deleteLength));

        scoreData.mergedScore[i] =
          pastMergedScore.substring(0, editStartPoint) +
          insertionString +
          pastMergedScore.substr(editStartPoint + deleteLength);
        scoreData.cursors[i] = copyOtherCursors(
          pastCursors,
          currentEdit.connectionId
        );
        scoreData.cursors[i][currentEdit.connectionId] = keyPoints.cursor;
      }
    }
  }
};

const sendUpdate = (
  myConnection: { connectionId: string; ws: ws },
  scoreId: string
) => {
  const scoreData = data[scoreId];

  // Check the connection has not already been closed
  if (scoreData) {
    const mergedScore =
      scoreData.mergedScore.length > 0
        ? scoreData.mergedScore[scoreData.mergedScore.length - 1]
        : scoreData.baseScore;
    const cursors =
      scoreData.cursors.length > 0
        ? scoreData.cursors[scoreData.cursors.length - 1]
        : undefined;
    const updateData: UpdateFromServer = {
      myConnectionId: myConnection.connectionId,
      score: mergedScore,
      myCursor: cursors ? cursors[myConnection.connectionId] : 0,
      otherCursors: copyOtherCursors(cursors, myConnection.connectionId),
    };
    myConnection.ws.send(JSON.stringify(updateData));
  }
};

const copyOtherCursors = (
  cursors: ClientCursorPositions | undefined,
  myConnectionId: string
) => {
  const otherCursors: ClientCursorPositions = {};
  if (cursors) {
    for (const connectionId in cursors) {
      if (connectionId !== myConnectionId) {
        otherCursors[connectionId] = cursors[connectionId];
      }
    }
  }
  return otherCursors;
};

const closeConnection = (
  myConnection: { connectionId: string; ws: ws },
  scoreId: string
) => {
  const clientList = clients[scoreId];

  // Check the connection has not already been closed
  if (clientList) {
    // Close this connection
    clientList.splice(clientList.indexOf(myConnection), 1);

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
    logger.info(
      `${eventDescription} for score ${scoreId};\n Current state for score ${scoreId}:\n\tMessage: ${(() => {
        const scoreData = data[scoreId];

        // Check the connection has not already been closed
        if (scoreData) {
          return scoreData.mergedScore.length > 0
            ? scoreData.mergedScore[scoreData.mergedScore.length - 1]
            : scoreData.baseScore;
        } else {
          return undefined;
        }
      })()}\n\tOpen Connections: ${clients[scoreId]?.length}`
    );
  }
};
export default scoreEditorFactory;
