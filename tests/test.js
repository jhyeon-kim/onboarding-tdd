import {
    cancelOrder,
    checkNiceApiResponse,
    completeCancel,
    completeOrder,
    initOrder, Order,
    ORDER_STATE
} from "../app/models/Order.js"
import StateError from "../app/error/StateError.js";
import NiceApiError from "../app/error/NiceApiError.js";
import UserStorage from "../app/models/UserStorage.js";
import {beforeEach} from "@jest/globals";
import ProductStorage from "../app/models/ProductStorage.js";
import StockError from "../app/error/StockError.js";
import Product from "../app/models/Product.js";
import {addProduct} from "../app/models/User.js";


// todo (1) database setup (2) mocking axios response from nicepay (3) anything else..

// 상태 의존성 확인 테스트 : STARTED, PAID, CANCEL_REQUESTED, CANCEL_COMPLETED (, REFUND_REQUESTED, REFUND_COMPLETED)

/*
* [주문/결제 도메인 개요]
* 1. 주문은 [STARTED, PAID, CANCEL_REQUESTED, CANCEL_COMPLETED] 와 같은 상태를 가진다.
* 2. 주문 상태는 이전 상태에 대해 의존성을 갖는다.
*   1) PAID 이전 상태는 STARTED 이어야 한다.
*   2) CANCEL_REQUESTED 이전 상태는 PAID 이어야 한다.
*   3) CANCEL_COMPLETED 이전 상태는 CANCEL_REQUESTED 이어야 한다.
* 3. 다음의 경우 결제에 실패한다.
*   1) nicePay routes 에서의 응답이 3011이 아니면 결제가 불가하다.
*   2) 비즈니스 로직 관련
*       (1) 해당 사용자 동일 강의 구매 내역 있음
*       (2) 재고 부족
* 4. 주문 상태 변경
* */

let now;
const userStorage = new UserStorage();
const user = userStorage.users[0];

 /*2. 주문 상태는 이전 상태에 대해 의존성을 갖는다.
   1) PAID 이전 상태는 STARTED 이어야 한다.
   2) CANCEL_REQUESTED 이전 상태는 PAID 이어야 한다.
   3) CANCEL_COMPLETED 이전 상태는 CANCEL_REQUESTED 이어야 한다.*/

describe('주문의 이전 상태 의존성 테스트', () => {
    beforeEach(() => {
        now = new Date();
    });

    test('PAID 이전 상태는 STARTED 이어야 한다. (실패)', () => {
        // given
        let order = createSampleOrderWithState(ORDER_STATE.PAID);
        //when & then
        expect(() => completeOrder(order)).toThrow(StateError);
    });

    test('PAID 이전 상태는 STARTED 이어야 한다. (성공)', () => {
        // given
        let order = createSampleOrderWithState(ORDER_STATE.STARTED);
        //when & then
        completeOrder(order);
        expect(order.state).toEqual(ORDER_STATE.PAID);
    });

    test('CANCEL_REQUESTED 이전 상태는 PAID 이어야 한다. (실패)', () => {
        // given
        let order = createSampleOrderWithState(ORDER_STATE.CANCEL_COMPLETED);
        //when & then
        expect(() => cancelOrder(order)).toThrow(StateError);
    });

    test('CANCEL_REQUESTED 이전 상태는 PAID 이어야 한다. (성공)', () => {
        // given
        let order = createSampleOrderWithState(ORDER_STATE.PAID);
        //when & then
        cancelOrder(order);
        expect(order.state).toEqual(ORDER_STATE.CANCEL_REQUESTED);
    });

    test('CANCEL_COMPLETED 이전 상태는 CANCEL_REQUESTED 이어야 한다. (실패)', () => {
        // given
        let order = createSampleOrderWithState(ORDER_STATE.CANCEL_COMPLETED);
        //when & then
        expect(() => completeCancel(order)).toThrow(StateError);
    });

    test('CANCEL_COMPLETED 이전 상태는 CANCEL_REQUESTED 이어야 한다. (성공)', () => {
        // given
        let order = createSampleOrderWithState(ORDER_STATE.CANCEL_REQUESTED);
        //when & then
        completeCancel(order);
        expect(order.state).toEqual(ORDER_STATE.CANCEL_COMPLETED);
    });
});

/* 3. 다음의 경우 결제에 실패한다.
   1) nicePay api에서의 응답이 3011이 아니면 결제가 불가하다
   2) 비즈니스 로직 관련
       (1) 해당 사용자 동일 강의 구매 내역 있음
       (2) 재고 부족 (예 - 인원수 기준 얼리버드 적용 특가 재고 이미 참)*/

// 1) nicePay api에서의 응답이 3011이 아니면 결제가 불가하다

describe('nicepay로부터의 응답에 따른 처리 테스트', () => {
    test('niceapi 응답코드가 3011이면 카드사 운영시간이 아니므로 결제 불가하다. (실패)', () => {
        let order = new Order();
        order.state = ORDER_STATE.STARTED;
        if (checkNiceApiResponse().statusCode === 3013) {
            expect(() => completeCancel(order)).toThrow(NiceApiError);
        }
    });
});


/*
2) 비즈니스 로직 관련
(1) 해당 사용자 동일 강의 구매 내역 있음
(2) 재고 부족 (예 - 인원수 기준 얼리버드 적용 특가 재고 이미 참)
*/

describe('사용자 구매내역에 따른 주문 개시 여부 테스트', () => {

    let same;
    let different;

    beforeEach(() => {
        same = new Product("same", 10000, 1e9);
        different = new Product("different", 10000, 1e9);
        // user.addProduct(same.productId);
        addProduct(user, same.productId);
    });

    afterEach(() => {
        user.products = [];
    });

    test("기존에 구매하지 않았던 강의만 구매할 수 있다. (실패)", () => {
        expect(() => initOrder(user, same)).toThrow("User has bought this product before.");
    });

    test("기존에 구매하지 않았던 강의만 구매할 수 있다. (성공)", () => {
        initOrder(user, different);
    });
});

describe('재고에 따른 주문 개시 여부 테스트', () => {
    const productStorage = new ProductStorage();
    const outOfStockProduct = productStorage.products[0];
    const enoughStockProduct = productStorage.products[1];

    test('재고가 없다면 주문을 개시할 수 없다. (실패)', () => {
        expect(() => initOrder(user, outOfStockProduct).toThrow(StockError));
    });

    test('재고가 없다면 주문을 개시할 수 없다. (성공)', () => {
        initOrder(user, enoughStockProduct);
        //todo 재고의 수도 줄어든다...
    });

});


// helper code
function createSampleOrderWithState(state) {
    return new Order({
        userId: "user1",
        productId: "product1",
        price: 10000,
        state: state
    });
}
// // practice..
// import { useAxios } from "../app/service/niceapi.js"
// import "whatwg-fetch";
//
// describe('nicepay api의 mock 응답에 따른 처리 테스트', () => {
//     test('뭐라고 이름을 할까. (성공)', async () => {
//         const result = await useAxios();
//         console.log(result);
//     });
// });

