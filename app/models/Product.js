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

    get price() {
        return this._price;
    }

    get productId() {
        return this._productId;
    }

}
//
// export const

let product = new Product("hey", 111);
console.log(product.productId)
