import { backendUrl } from "../config";

var ws: undefined | WebSocket;
var callback: undefined | ((message: string) => void);

export const openSocket = (
  scoreId: string,
  messageHandler: (message: string) => void
) => {
  if (ws === undefined) {
    ws = new WebSocket(`ws://${backendUrl}/editor/${scoreId}`);
    ws.onmessage = (event) => {
      receiveMessage(event.data as string);
    };
  }
  callback = messageHandler;
};

export const sendMessage = (message: string) => {
  ws?.send(message);
};

const receiveMessage = (message: string) => {
  setTimeout(() => {
    if (callback) {
      callback(message);
    }
  }, 0);
};

export const closeSocket = () => {
  ws?.close();
  ws = undefined;
};
