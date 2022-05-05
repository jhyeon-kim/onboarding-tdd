import Product from "./Product.js";

// Dummy data and storage

const outOfStock = new Product("outOfStock", 5000000, 0);
const enoughStock = new Product("enoughStock", 5000000, 1e18);
const generalProduct = new Product("enoughStock", 5000000, 1e9);

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
console.log("🤓", outOfStock.productId)
const productStorage = new ProductStorage();
const product = productStorage.findProductById(outOfStock.productId);
console.log("🍀", product.productId, product.name);
