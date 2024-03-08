import { Server, Socket } from "socket.io";
import { RoomManager } from "./managers/RoomManager";

interface User {
  name:string;
  socket:Socket;
}

const io = new Server({
    cors: {
      origin: "*" // http://localhost:5173 if using vite * allows all
    }
  });
  
io.listen(3000);

const roomManager = new RoomManager();



io.on("connection" ,(socket) => {

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
        console.log(`Room full with room Id ${room.roomId}`)
        console.log(socket.id);
        socket.emit('room-full');
        return;
      }
      else
      {
        room.users.push(user);
        console.log(`User with socket id ${socket.id} is initiating call`);
        const senderIndex:number = room.users.findIndex((user) => user.socket.id === socket.id);
        const receiverIndex:number = senderIndex ? 0 : 1 ; // if senderIndex is 1 then receiver is 0 else vice versa 
        const sendingUser = room.users[senderIndex].socket.id;
        const receivingUser = room.users[receiverIndex].socket.id;
        socket.to(receivingUser).emit('start' , roomId); // User2 is initiating a connection with User1
 
      }
    }
    else
    {
      roomManager.createRoom(roomId , user);
    }
    socket.emit('handle-join');
    
  })
  
    socket.on('offer', (offer , roomId ) => {
      console.log(`Offer  is created by User with socket Id ${socket.id}`);
      const room=roomManager.searchRoom(roomId);
      if(!room)
        {
          console.log(`No room with roomId ${roomId} exists`);
          return;
        }
      const senderIndex:number = room.users.findIndex((user) => user.socket.id === socket.id);
      const receiverIndex:number = senderIndex ? 0 : 1 ; // if senderIndex is 1 then receiver is 0 else vice versa 
      const sendingUser = room.users[senderIndex].socket.id;
      const receivingUser = room.users[receiverIndex].socket.id;
      //const user=room?.users[1].socket.id;
      if(receivingUser)
      {
        console.log(`Sending the offer to User with socket id ${receivingUser}`);
        socket.to(receivingUser).emit('offer' , offer , roomId);
      }
      else
      {
        console.log("There is only one User in the room");
      }
  });

    socket.on("answer" , (answer , roomId) => {
      console.log(`Answer is created by User with socket Id ${socket.id}`);
      const room=roomManager.searchRoom(roomId);
      if(!room)
        {
          console.log(`No room with roomId ${roomId} exists`);
          return;
        }
      const senderIndex:number = room.users.findIndex((user) => user.socket.id === socket.id);
      const receiverIndex:number = senderIndex ? 0 : 1 ; // if senderIndex is 1 then receiver is 0 else vice versa 
      const sendingUser = room.users[senderIndex].socket.id;
      const receivingUser = room.users[receiverIndex].socket.id;
      //const user=room?.users[0].socket.id; // Getting user1's socketId
      if(receivingUser)
      {
        console.log(`Sending the answer to User with socket id ${receivingUser}`);
        socket.to(receivingUser).emit('answer' , answer , roomId);
      }
      else
      {
        console.log("There is only one User in the room");
      }
    })

    socket.on("add-ice-candidate" , (candidate , roomId) => {
      const room=roomManager.searchRoom(roomId);
      if(!room)
        {
          console.log(`No room with roomId ${roomId} exists`);
          return;
        }
      const senderIndex:number = room.users.findIndex((user) => user.socket.id === socket.id);
      const receiverIndex:number = senderIndex ? 0 : 1 ; // if senderIndex is 1 then receiver is 0 else vice versa 
      const sendingUser = room.users[senderIndex].socket.id;
      const receivingUser = room.users[receiverIndex].socket.id;
      console.log(`ice candidates are generated by User with socket id ${sendingUser}`);
      console.log(`ice candidates are sent to User with socket id ${receivingUser}`);
      socket.to(receivingUser).emit('add-ice-candidate' , candidate , roomId);
    })

    
    socket.on("disconnect", () => {
      roomManager.removeUser(socket);
    });

})





