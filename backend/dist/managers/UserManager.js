"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
class UserManager {
    constructor(name, socket) {
        this.user = {
            socket,
            name
        };
    }
}
exports.UserManager = UserManager;
// export class UserManager{
//     private users: User[];
//     constructor (){
//         this.users = [];
//     }
//     addUser(name:string , socket:Socket)
//     {
//         console.log("A new User added");
//         this.users.push({name , socket});
//     }
//     removeUser(socketId : string)
//     {
//         this.users.filter((user) => user.socket.id === socketId);
//     }
// }
