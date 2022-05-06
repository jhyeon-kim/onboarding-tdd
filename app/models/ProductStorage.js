import Product from "./Product.js";

// Dummy data and storage

const outOfStock = new Product("outOfStock", 5000000, 0);
const enoughStock = new Product("enoughStock", 5000000, 1000);
const generalProduct = new Product("generalProduct", 5000000, 1000);
const addedProduct = new Product("addedProduct", 5000000, 1000);

export default class ProductStorage {
    products = [outOfStock, enoughStock, generalProduct];

    findProductById(productId) {
        for (const product of this.products) {
            if (productId === product.productId) {
                return product;
            }
        }
        return null;
    }

};
