import {retrieveSpecificProduct} from './DAL/product-db-actions';

export const mainCart: { id: string, users: { userId: string, amount: number }[] }[] = [];

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

export const removeFromCart = async (userId: string, productId: string) => {
    const product = await retrieveSpecificProduct(productId);
    if (!product)
        throw new Error('Item not found!');
    const productInMainCart = findProductInMainCart(productId);
    if (productInMainCart) {
        removeUserFromItemInMainCart(userId, productInMainCart);
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

const getAmountOfItemInMainCart = (cartItem: { id: string, users: { userId: string, amount: number }[] }) => {
    let amountInCarts = 0;
    cartItem.users.forEach(user => amountInCarts += user.amount);
    return amountInCarts;
};

const updateProductInMainCart = (userId: string, amount: number, cartItem: { id: string, users: { userId: string, amount: number }[] }) => {
    let userFound = false;
    cartItem.users.forEach(user => {
        if (user.userId === userId) {
            user.amount += amount;
            userFound = true;
        }
    });
    if (!userFound) {
        const newUser = {userId, amount};
        cartItem.users.push(newUser);
    }
};

const removeUserFromItemInMainCart = (userId: string, cartItem: { id: string, users: { userId: string, amount: number }[] }) => {
    const newUsers = cartItem.users.filter(user => user.userId !== userId);
    if (newUsers.length === cartItem.users.length) {
        throw new Error('Item not in user cart')
    } else {
        cartItem.users = newUsers;
    }
};

export const buildBuyListForUser = (userId: string) => {
    const buyList: { id: string; quantity: number; }[] = [];
    mainCart.forEach(itemInMainCart => {
        itemInMainCart.users.forEach(user => {
            if (user.userId === userId)
                buyList.push({id: itemInMainCart.id, quantity: user.amount});
        });
    });
    return buyList;
};

export const removeUserFromAllItems = async (id: string) => {
    const buyList = buildBuyListForUser(id);
    return await Promise.all(buyList.map(async item => {
        const newQuantity = await removeFromCart(id, item.id);
        return {id: item.id, newQuantity};
    }));
};