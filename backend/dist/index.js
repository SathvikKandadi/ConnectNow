"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server({
    cors: {
        origin: "http://localhost:5173"
    }
});
io.listen(3000);
io.on("connection", (socket) => {
    console.log(`Socket connected`, socket.id);
    socket.on('offer', offer => {
        // Handle offer from peer
        console.log("Offer received");
        console.log(offer);
        socket.broadcast.emit('offer', offer);
        // socket.broadcast.emit('offer', offer);
    });
    socket.on("answer", (answer) => {
        console.log("Answer received");
        console.log(answer);
        socket.broadcast.emit('answer', answer);
    });
    socket.on("add-ice-candidate", (candidate) => {
        socket.broadcast.emit('add-ice-candidate', candidate);
    });
});
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
