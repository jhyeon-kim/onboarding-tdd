import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        default: [],
    }
}, {timestamps: true});

export const User = mongoose.model('User', userSchema);

// 구매내역 추가시키기
export const addProduct = (userObject, productId) => {
    userObject.products.push(productId);
}

export const findProduct = (userObject, productId) => {
    for (const productIdElement of userObject.products) {
        if (productIdElement === productId) {
            return true;
        }
    }
    return false;
}

