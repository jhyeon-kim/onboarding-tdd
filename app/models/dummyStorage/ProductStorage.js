import {Product} from "../Product.js";

// Dummy data and storage
const product1 = new Product({
    name: "outOfStock",
    price: 5000000,
    stock: 0
});

const product2 = new Product({
    name: "enoughStock1",
    price: 5000000,
    stock: 5000000
});

const product3 = new Product({
    name: "enoughStock2",
    price: 5000000,
    stock: 5000000
});

const product4 = new Product({
    name: "enoughStock3",
    price: 5000000,
    stock: 5000000
});

export default class ProductStorage {
    products = [product1, product2, product3, product4];

    findProductById(productId) {
        for (const product of this.products) {
            if (productId === product.productId) {
                return product;
            }
        }
        return null;
    }

};
