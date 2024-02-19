import { Socket } from "socket.io";

interface User {
    name: string;
    socket: Socket;
}

interface Room {
    roomId: string;
    users: User[];

}


export class RoomManager {
    private rooms: Room[];

    constructor() {
        this.rooms = [];
    }

    createRoom(roomId: string, user: User) {
        const users: User[] = [];
        users.push(user);
        this.rooms.push({
            roomId,
            users: users
        })
    }

    searchRoom(roomId: string) {
        const room = this.rooms.find((room) => room.roomId === roomId);
        return room;
    }

    getUsers(roomId: string) {
        const room = this.rooms.find((room) => room.roomId === roomId);
        return room?.users;
    }

    removeUser(socket: Socket) {
        this.rooms.forEach(room => {
            const index = room.users.findIndex((user) => user.socket === socket);
            if (index !== -1) {
                const removedUser = room.users.splice(index, 1)[0];
                if (removedUser)
                    console.log(`User with socket id ${removedUser?.socket.id} has left the room ${room.roomId}`);
                if (room.users.length === 0) {
                    this.rooms = this.rooms.filter(r => r !== room);
                    console.log(`Room ${room.roomId} has been deleted as it has no users.`);
                }

            }
        });
    }


}