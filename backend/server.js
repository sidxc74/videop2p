import express from 'express';
import cors from 'cors';
import { createServer } from 'http';  // Updated import
import { Server } from 'socket.io';

const Users = [];

const app = express();
const server = createServer(app);  // Updated server creation
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  

  socket.on('create-room', ({ name, roomid }) => {
    socket.join(roomid);
    console.log("handling create room")
    
  });

  socket.on('join-room',({name,roomid}) => {
    // io.to(roomid).emit('user-joined',{from : socket.id, name:name})
    io.to(roomid).emit('user-joined', { from: socket.id, roomid: roomid });
    console.log("handling join room in backenb")
    socket.join(roomid);
    
  })

  socket.on('call',({to,offer})=>{
    console.log("handling call in backend")
        io.to(to).emit('incomming-call',{from : socket.id, offer});
  })

  socket.on('call-accepted',({to,answer})=>{
    console.log("handling call-accepted in backend")
    console.log(answer)
    io.to(to).emit('answer',{from : socket.id,sdp : answer});
  })

  socket.on('ice-candidate', ({ to, candidate }) => {
    console.log("handling ice candidate in backend")
    io.to(to).emit('ice-candidate', { from: socket.id, candidate });
  });

  

  // Add more socket events as needed

  // Example: handle disconnect event
  socket.on('disconnect', () => {
    // console.log(`user disconnected ${socket.id}`);
    // Perform any cleanup or necessary actions on user disconnect
  });
});

server.listen(5000, () => {
  console.log('server started on 5000');
});

