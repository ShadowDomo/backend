import * as express from 'express';
import {Socket} from 'socket.io';

/** Generic socket handler. */
export function broadcast(
  req: express.Request,
  eventName: string,
  body: any,
  room: string
) {
  const app = req.app;
  const io: Socket = app.get('io');
  io.to(room).emit(eventName, body);
}
