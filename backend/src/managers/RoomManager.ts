//import { User } from "./UserManager";

import { Socket } from "socket.io";


interface User {
    name:string;
    socket:Socket;
}

interface Room {
    roomId:string;
    users:User[];

}


export class RoomManager
{
    private rooms:Room[];

    constructor()
    {
        this.rooms = [];
    }

    createRoom(roomId:string , user:User)
    {
        const users:User[] = [];
        users.push(user);
        this.rooms.push({
            roomId,
            users:users
        })
    }

    searchRoom(roomId:string)
    {
        const room =  this.rooms.find((room) => room.roomId === roomId);
        return room;
    }

    getUsers(roomId:string)
    {
        const room =  this.rooms.find((room) => room.roomId === roomId);
        return room?.users;
    }

    removeUser(socket:Socket)
    {
        console.log(socket);
        this.rooms.forEach(room => {
            const user = room.users.find((user) => user.socket === socket);
            room.users.filter((user) => user.socket === socket);
            console.log(`User ${user?.socket.id} has left the room`);
        })
    }


}