import { v4 } from "uuid";

export default class Product {

    constructor(name, price) {
        this._productId = v4();
        this._name = name;
        this._price = price;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get productId() {
        return this._productId;
    }

    set productId(value) {
        this._productId = value;
    }
}
//
// export const

let product = new Product("hey", 111);
console.log(product.productId)
