import {retrieveSpecificProduct} from './DAL/product-db-actions';


export const mainCart: Map<string, Map<string, number>> = new Map();

const retrieveProductFromDB = async (productId: string) => {
    const productInDB = await retrieveSpecificProduct(productId);
    if (!productInDB) {
        throw new Error('Product not found!');
    }
    return productInDB;
};

export const addToCart = async (userId: string, productId: string, desiredQuantity: number) => {
    const productInDB = await retrieveProductFromDB(productId);
    if (!mainCart.has(productId)) {
        mainCart.set(productId, new Map());
    }
    const availableQuantity = productInDB.quantity - getQuantityOfItemInMainCart(productId);
    if (availableQuantity < desiredQuantity) {
        throw new Error('Quantity not enough!');
    }
    let currentQuantityInUserCart = 0;
    if (mainCart.get(productId).has(userId)) {
        currentQuantityInUserCart = mainCart.get(productId).get(userId);
    }
    mainCart.get(productId).set(userId, currentQuantityInUserCart + desiredQuantity);
    return availableQuantity - desiredQuantity;
};

export const removeFromCart = async (userId: string, productId: string, quantityToRemove: number) => {
    const productInDB = await retrieveProductFromDB(productId);
    if (!mainCart.has(productId) || !mainCart.get(productId).has(userId)) {
        throw new Error('Product not in user cart!');
    }
    if (quantityToRemove > mainCart.get(productId).get(userId)) {
        throw new Error('Can not remove more quantity than what you have...');
    }
    const currentQuantityInUserCart = mainCart.get(productId).get(userId);
    mainCart.get(productId).set(userId, currentQuantityInUserCart - quantityToRemove);
    return productInDB.quantity - getQuantityOfItemInMainCart(productId);
};

export const buildBuyListForUser = (userId: string) => {
    const buyList: { id: string; quantity: number; }[] = [];
    mainCart.forEach(((usersMap, productId) => {
        if (usersMap.has(userId)) {
            buyList.push({id: productId, quantity: usersMap.get(userId)});
        }
    }));
    return buyList;
};


const getQuantityOfItemInMainCart = (productId: string) => {
    let totalAmount = 0;
    mainCart.get(productId).forEach(((quantity: number) => totalAmount += quantity));
    return totalAmount;
};

export const cleanUserCart = async (userId: string) => {
    const userBuyList = buildBuyListForUser(userId);
    return await Promise.all(userBuyList.map(async (item) => {
        const newQuantity = await removeFromCart(userId, item.id, item.quantity);
        return {id: item.id, newQuantity};
    }));
};