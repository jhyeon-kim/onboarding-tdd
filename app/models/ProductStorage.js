import Product from "./Product.js";

// Dummy data and storage

const outOfStock = new Product("outOfStock", 5000000, 0);
const enoughStock = new Product("enoughStock", 5000000, 5000000);
const generalProduct = new Product("generalProduct", 5000000, 1000);
const addedProduct = new Product("addedProduct", 5000000, 1000);

// stock === index 가 되도록 (매우 많은 데이터를) 넣어둔다..

export default class ProductStorage {
    products = [outOfStock, enoughStock, generalProduct, addedProduct];

    findProductById(productId) {
        for (const product of this.products) {
            if (productId === product.productId) {
                return product;
            }
        }
        return null;
    }

};
