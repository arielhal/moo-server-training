import {retrieveSpecificProduct} from './DAL/product-db-actions';


export const mainCart: Map<string, Map<string, number>> = new Map();

export const addToCart = async (userId: string, productId: string, desiredQuantity: number) => {
    const productInDB = await retrieveSpecificProduct(productId);
    if (!productInDB) {
        throw new Error('Product not found!');
    }
    if (!mainCart.has(productId)) {
        mainCart.set(productId, new Map());
    }
    if (mainCart.get(productId).has(userId)) {
        throw new Error('Product already in user cart. Please remove first to add new quantity');
    }
    const availableQuantity = productInDB.quantity - getQuantityOfItemInMainCart(productId);
    if (availableQuantity < desiredQuantity) {
        throw new Error('Quantity not enough!');
    }
    mainCart.get(productId).set(userId, desiredQuantity);
    return availableQuantity - desiredQuantity;
};

export const removeFromCart = async (userId: string, productId: string) => {
    const productInDB = await retrieveSpecificProduct(productId);
    if (!productInDB) {
        throw new Error('Product not found!');
    }
    if (!mainCart.has(productId) || !mainCart.get(productId).has(userId)) {
        throw new Error('Product not in user cart!');
    }
    mainCart.get(productId).delete(userId);
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
        const newQuantity = await removeFromCart(userId, item.id);
        return {id: item.id, newQuantity};
    }));
};