import {Socket} from 'socket.io';

let currentUserId = 0;
const usersList: { id: string, socket: Socket }[] = [];
export const getNewUserId = () => ++currentUserId;
export const addNewUser = (id: string, socket: Socket) => usersList.push({id, socket});
export const isUserExist = (id: string) => {
    let found = false;
    usersList.forEach(user => {
        if (user.id === id) found = true
    });
    return found;
};

export const getUserSocket: (id: string) => Socket = (id: string) => {
    let socket = null;
    usersList.forEach(user => {
        if (user.id === id)
            socket = user.socket;
    });
    return socket;
};


