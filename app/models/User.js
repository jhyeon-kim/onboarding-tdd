import { v4 } from 'uuid';

export default class User {
    constructor(name) {
        this._userId = v4();
        this._name = name;
        this._products = [];
    }

    get name() {
        return this._name;
    }

    get products() {
        return this._products;
    }

    set products(value) {
        this._products = value;
    }

    get userId() {
        return this._userId;
    }


// 구매내역 추가시키기
    addProduct(productId) {
        this._products.push(productId);
    }

    findProduct(productId) {
        for (const productIdElement of this.products) {
            if (productIdElement === productId) {
                return true;
            }
        }
        return false;

        // return !!this._products.contains(productId);

    }

}
