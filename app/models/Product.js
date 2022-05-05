import { v4 } from "uuid";
import StockError from "../error/StockError.js";

export default class Product {

    constructor(name, price, stock) {
        this._productId = v4();
        this._name = name;
        this._price = price;
        this._stock = stock;
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

    get stock() {
        return this._stock;
    }

    subStock() {
        if (this._stock > 0) {
            this._stock -= 1;
            return true;
        } else {
            return false;
        }
    }

}

const product = new Product("안뇽", "131313", 0);
console.log(product.subStock())
console.log(product.stock)