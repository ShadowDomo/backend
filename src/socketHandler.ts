import {Socket} from 'socket.io';

// holds threadIDs and sockets which are connected
// export const connections: Object = {}; // TODO dont need this

/** The handler for all socket connections. */
const onConnection = (socket: Socket) => {
  // client sends the current threadID
  const clientID = socket.id;
  let threadID: string;
  socket.on('onThread', response => {
    threadID = response;
    socket.join(threadID);
    // console.log(socket.rooms);
  });
  // send socket ID
  socket.emit('your id', clientID);

  // socket.on('disconnect', () => disconnect(threadID, clientID));
  // TODO clean up empty rooms

  // function emitMessageToClient() {
  //   socket.emit('update', 'someone made an update to this thread');
  // }
};

// function disconnect(threadID: string, clientID: string) {
//   console.log('DISCONNECTED');
//   if (!Object.prototype.hasOwnProperty.call(connections, threadID)) {
//     return;
//   }
//   if (!connections[threadID].has(clientID)) {
//     return;
//   }

//   connections[threadID].delete(clientID);
//   console.log(connections);
// }

// function onThread(response: string, clientID: string) {
//   const threadID = response;
//   // console.log('received data from client response was: ' + threadID);

//   // if (!Object.prototype.hasOwnProperty.call(connections, threadID)) {
//   //   connections[threadID] = new Set();
//   // }

//   // connections[threadID].add(clientID);
//   // console.log(connections);

//   return threadID;
// }

export default onConnection;
