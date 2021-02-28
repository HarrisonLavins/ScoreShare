import { EditToServerUpdate, UpdateFromServer } from "../../../@types";
import { backendUrl } from "../config";

var ws: undefined | WebSocket;
var callback: undefined | ((date: UpdateFromServer) => void);
var connectionId: string = "";

export const openSocket = (
  scoreId: string,
  messageHandler: (date: UpdateFromServer) => void
) => {
  if (ws === undefined) {
    ws = new WebSocket(`ws://${backendUrl}/editor/${scoreId}`);
    ws.onmessage = (event) => {
      receiveMessage(event.data as string);
    };
  }
  callback = messageHandler;
};

export const sendMessage = (
  original: string,
  updated: string,
  cursor: number
) => {
  const updateData: EditToServerUpdate = {
    connectionId,
    original,
    updated,
    cursor,
    editTime: Date.now(),
  };
  ws?.send(JSON.stringify(updateData));
};

const receiveMessage = (messageString: string) => {
  setTimeout(() => {
    if (callback) {
      callback(JSON.parse(messageString) as UpdateFromServer);
    }
  }, 0);
};

export const closeSocket = () => {
  ws?.close();
  ws = undefined;
  connectionId = "";
};
