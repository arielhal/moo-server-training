import {retrieveSpecificProduct} from './DAL/product-db-actions';

const mainCart: { id: string, users: { ip: string, amount: number }[] }[] = [];

export const addToCart = async (ip: string, productId: string, desiredAmount: number) => {
    const product = await retrieveSpecificProduct(productId);
    let availableAmount;
    if (!product)
        throw new Error('Item not found!');
    let productInMainCart = findProductInMainCart(productId);
    if (productInMainCart) {
        availableAmount = product.quantity - getAmountOfItemInMainCart(productInMainCart);
    } else {
        availableAmount = product.quantity;
        productInMainCart = {id: productId, users: []};
        mainCart.push(productInMainCart);
    }
    if (desiredAmount <= availableAmount)
        updateProductInMainCart(ip, desiredAmount, productInMainCart);
    else
        throw new Error('Quantity not enough');
    return availableAmount - desiredAmount;
};

export const removeFromCart = async (ip: string, productId: string) => {
    const product = await retrieveSpecificProduct(productId);
    if (!product)
        throw new Error('Item not found!');
    const productInMainCart = findProductInMainCart(productId);
    if (productInMainCart) {
        removeUserFromItemInMainCart(ip, productInMainCart);
        return product.quantity - getAmountOfItemInMainCart(productInMainCart);
    } else
        throw new Error('Item not found!');
};

const findProductInMainCart: (id: string) => any = (id: string) => {
    let foundItem;
    mainCart.forEach(cartItem => {
        if (cartItem.id === id)
            foundItem = cartItem;
    });
    return foundItem ? foundItem : null;
};

const getAmountOfItemInMainCart = (cartItem: { id: string, users: { ip: string, amount: number }[] }) => {
    let amountInCarts = 0;
    cartItem.users.forEach(user => amountInCarts += user.amount);
    return amountInCarts;
};

const updateProductInMainCart = (ip: string, amount: number, cartItem: { id: string, users: { ip: string, amount: number }[] }) => {
    let userFound = false;
    cartItem.users.forEach(user => {
        if (user.ip === ip) {
            user.amount += amount;
            userFound = true;
        }
    });
    if (!userFound) {
        const newUser = {ip, amount};
        cartItem.users.push(newUser);
    }
};

const removeUserFromItemInMainCart = (ip: string, cartItem: { id: string, users: { ip: string, amount: number }[] }) => {
    const newUsers = cartItem.users.filter(user => user.ip !== ip);
    if (newUsers.length === cartItem.users.length) {
        throw new Error('Item not in user cart')
    } else {
        cartItem.users = newUsers;
    }
};