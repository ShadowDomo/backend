import {Socket} from 'socket.io';

// holds threadIDs and sockets which are connected
// export const connections: Object = {}; // TODO dont need this

/** The handler for all socket connections. */
const onConnection = (socket: Socket) => {
  // client sends the current threadID

  // for each thread
  const clientID = socket.id;
  socket.on('onThread', threadID => {
    socket.join(threadID);
  });

  // for community home pages
  socket.on('onCommunity', communityName => {
    socket.join(communityName);
  });

  // send socket ID
  socket.emit('your id', clientID);
};

export default onConnection;
