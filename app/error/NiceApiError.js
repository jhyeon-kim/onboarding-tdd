export default class NiceApiError extends Error {
    constructor(code) {
        super();
        this.code = code;
    }
}