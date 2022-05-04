import StateError from "../error/StateError.js";

export const ORDER_STATE = {
    STARTED: "orderStarted",
    PAID: "orderPaid",
    CANCEL_REQUESTED: "cancelRequested",
    CANCEL_COMPLETED: "cancelCompleted",
    // cancel 과 refund 둘다 있어야 할까?
    REFUND_REQUESTED: "refundRequested",
    REFUND_COMPLETED: "refundCompleted"
}

export default class Order {

    constructor(userId, productId, price, state, createdAt, updatedAt) {
        this._userId = userId;
        this._productId = productId;
        this._price = price;
        this._state = state;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get productId() {
        return this._productId;
    }

    set productId(value) {
        this._productId = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}

export const completeOrder = (orderObject) => {
    checkState(orderObject, ORDER_STATE.STARTED);
    //todo 진짜 로직
    orderObject.state = ORDER_STATE.PAID;
}

export const cancelOrder = (orderObject) => {
    checkState(orderObject, ORDER_STATE.PAID);
    //todo 진짜 로직
    orderObject.state = ORDER_STATE.CANCEL_REQUESTED;
}

export const completeCancel = (orderObject) => {
    checkState(orderObject, ORDER_STATE.CANCEL_REQUESTED);
    //todo 진짜 로직
    orderObject.state = ORDER_STATE.CANCEL_COMPLETED;
}

function checkState(orderObject, state) {
    if (orderObject.state !== state) {
        throw new StateError(`PAID 이전 상태는 ${state} 이어야 한다.`);
    }
}


