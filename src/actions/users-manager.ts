import {Socket} from 'socket.io';

let nextUserId = 1;
const usersList: { id: string, socket?: Socket }[] = [];
export const addNewUser = (id: string, socket?: Socket) => usersList.push({id, socket});
export const isUserExist = (id: string) => usersList.find((user) => user.id === id);
export const getUserSocket = (id: string) => usersList.find((user) => user.id === id).socket;
export const getNewUserId = () => nextUserId++;