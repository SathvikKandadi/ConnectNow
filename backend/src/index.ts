import { Server, Socket } from "socket.io";
import { RoomManager } from "./managers/RoomManager";

interface User {
  name:string;
  socket:Socket;
}

const io = new Server({
    cors: {
      origin: "http://localhost:5173"
    }
  });
  
io.listen(3000);

const roomManager = new RoomManager();

io.on("connection" ,(socket) => {

  //console.log(`Socket connected` , socket.id);

 
 socket.on('room-joined' , (roomId , username) => {
    console.log(`User with socket id ${socket.id} has joined room ${roomId}`);
    const user : User = {
      name:username,
      socket
    }

    const room = roomManager.searchRoom(roomId);

    if(room)
    {
      if(room.users.length === 2)
      {
        // socket.broadcast.emit('room-full');
        console.log(`Room full with room Id ${room.roomId}`)
        console.log(socket.id);
        socket.emit('room-full');
        return;
      }
      else
      {
        room.users.push(user);
        socket.join(roomId);
        socket.to(room.users[0].socket.id).emit('start'); // User2 is initiating a connection with User1 
        //io.to(roomId).emit('start');
      }
    }
    else
    {
      roomManager.createRoom(roomId , user);
      socket.join(roomId);
    }

    

    socket.emit('handle-video');
    
  })
  
    socket.on('offer', offer => {
      console.log("Offer received");
      console.log(offer);
      socket.broadcast.emit('offer' , offer);
     
  });

    socket.on("answer" , (answer) => {
      console.log("Answer received")
      console.log(answer);
      socket.broadcast.emit('answer',answer);
    })

    socket.on("add-ice-candidate" , (candidate) => {
      socket.broadcast.emit('add-ice-candidate' , candidate);
    })

    socket.on("disconnect", () => {
      roomManager.removeUser(socket);
    });

  
})



// socket.on('answer', answer => {
  //     // Handle answer from peer
  //     socket.broadcast.emit('answer', answer);
  // });

  // socket.on('iceCandidate', candidate => {
  //     // Handle ICE candidate from peer
  //     socket.broadcast.emit('iceCandidate', candidate);
  // });

// import express, { Request, Response } from 'express';
// import http from 'http';
// import { Server , Socket } from 'socket.io';

// const app = express()
// const server = http.createServer(app);
// const io = new Server(server);

// const port = 3000

// app.get('/', (req : Request, res : Response) => {
//   res.send('Hello World!')
// })

// io.on('connection', (socket: Socket) => {
//     console.log('A user connected');
  
//     // Handle chat messages
//     socket.on('chat message', (msg: string) => {
//       io.emit('chat message', msg);
//     });
  
//     socket.on('disconnect', () => {
//       console.log('User disconnected');
//     });
//   });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

