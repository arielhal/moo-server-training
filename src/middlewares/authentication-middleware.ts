import {Context} from 'koa';
import {addNewUser, getNewUserId, isUserExist} from '../actions/users-manager';

export const authenticationMiddleware = async (ctx: Context, next: () => Promise<any>) => {
    if (!ctx.cookies.get('Auth') || !isUserExist(ctx.cookies.get('Auth'))) {
        const newUserId = getNewUserId().toString();
        ctx.cookies.set('Auth', newUserId);
        addNewUser(newUserId);
    }
    await next();
};