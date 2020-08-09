export class CheckoutError extends Error {
    constructor(errorList: { id: string, message: string }[]) {
        super(JSON.stringify({errors: errorList}));
    }
}