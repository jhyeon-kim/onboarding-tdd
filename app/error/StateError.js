export default class StateError extends Error {
    constructor(message) {
        super();

        // this.code = code
        this.message = message
    }
}