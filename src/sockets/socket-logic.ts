import {logger} from '../utils/logger';
import {addNewUser} from '../actions/users-manager';
import {cleanUserCart} from '../actions/cart-manager';
import {server} from '../app';
import socket = require('socket.io');

export const io = new socket(server);

export const initiateSocketEvents = async () => {
    io.on('connection', (sock) => {
        logger.info('a user connected');
        addNewUser(sock.id, sock);
        sock.on('disconnect', async () => {
            logger.info('user disconnected');
            const newQuantitiesList = await cleanUserCart(sock.id);
            newQuantitiesList.forEach(item => io.emit('update', JSON.stringify(item)));
        });
    });
};