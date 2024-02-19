"use strict";
//import { User } from "./UserManager";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
class RoomManager {
    constructor() {
        this.rooms = [];
    }
    createRoom(roomId, user) {
        const users = [];
        users.push(user);
        this.rooms.push({
            roomId,
            users: users
        });
    }
    searchRoom(roomId) {
        const room = this.rooms.find((room) => room.roomId === roomId);
        return room;
    }
    getUsers(roomId) {
        const room = this.rooms.find((room) => room.roomId === roomId);
        return room === null || room === void 0 ? void 0 : room.users;
    }
    removeUser(socket) {
        console.log(socket);
        this.rooms.forEach(room => {
            const user = room.users.find((user) => user.socket === socket);
            room.users.filter((user) => user.socket === socket);
            console.log(`User ${user === null || user === void 0 ? void 0 : user.socket.id} has left the room`);
        });
    }
}
exports.RoomManager = RoomManager;
