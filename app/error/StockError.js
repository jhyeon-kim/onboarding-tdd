export default class StockError extends Error {
    constructor() {
        super();

        // this.code = code
        this.message = "Out Of Stock!"
    }
}