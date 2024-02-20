"use strict";
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
        this.rooms.forEach(room => {
            const index = room.users.findIndex((user) => user.socket === socket);
            if (index !== -1) {
                const removedUser = room.users.splice(index, 1)[0];
                if (removedUser)
                    console.log(`User with socket id ${removedUser === null || removedUser === void 0 ? void 0 : removedUser.socket.id} has left the room ${room.roomId}`);
                if (room.users.length === 0) {
                    this.rooms = this.rooms.filter(r => r !== room);
                    console.log(`Room ${room.roomId} has been deleted as it has no users.`);
                }
            }
        });
    }
}
exports.RoomManager = RoomManager;
