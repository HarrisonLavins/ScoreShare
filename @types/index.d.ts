export interface EditToServerUpdate {
  connectionId: string;
  original: string;
  updated: string;
  cursor: number;
  editTime: number;
}

export interface UpdateFromServer {
  score: string;
  myConnectionId: string;
  myCursor: number;
  otherCursors: ClientCursorPositions;
}

export type ClientCursorPositions = { [key: string]: number };
