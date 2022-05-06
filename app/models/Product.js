import { v4 } from "uuid";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    stock: {
        type: Number
    }
}, {timestamps: true});

export const Product = mongoose.model('Product', productSchema);

export const subStock = (productObject) => {
    if (productObject.stock > 0) {
        productObject.stock -= 1;
        return true;
    } else {
        return false;
    }
}

//
// export default class Product {
//
//     constructor(name, price, stock) {
//         this._productId = v4();
//         this._name = name;
//         this._price = price;
//         this._stock = stock;
//     }
//
//     get name() {
//         return this._name;
//     }
//
//     get price() {
//         return this._price;
//     }
//
//     get productId() {
//         return this._productId;
//     }
//
//     get stock() {
//         return this._stock;
//     }
//
//     set stock(value) {
//         this._stock = value;
//     }
//
//     subStock() {
//         if (this.stock > 0) {
//             this.stock -= 1;
//             return true;
//         } else {
//             return false;
//         }
//     }
// }