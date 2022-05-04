import Order, {cancelOrder, completeCancel, completeOrder, ORDER_STATE, checkNiceApiResponse } from "../app/models/Order.js"
import StateError from "../app/error/StateError.js";
import NiceApiError from "../app/error/NiceApiError.js";

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
*   1) nicePay api 에서의 응답이 3011이 아니면 결제가 불가하다.
*   2) 비즈니스 로직 관련
*       (1) 재고 부족 (예 - 인원수 기준 얼리버드 적용 특가 재고 이미 참)
*       (2) 주문 관련 필드 누락
*       (3) 해당 사용자 동일 강의 구매 내역 있음 (mysql or mongodb)
* */

let now;

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
       (1) 재고 부족 (예 - 인원수 기준 얼리버드 적용 특가 재고 이미 참)
       (2) 주문 관련 필드 누락
       (3) 해당 사용자 동일 강의 구매 내역 있음 (mysql or mongodb)*/

describe('nicepay로부터의 응답에 따른 처리 테스트', () => {
    test('niceapi 응답코드가 3011이면 카드사 운영시간이 아니므로 결제 불가하다.', () => {
        let order = new Order();
        order.state = ORDER_STATE.STARTED;
        if (checkNiceApiResponse().statusCode === 3013) {
            expect(() => completeCancel(order)).toThrow(NiceApiError);
        }
    });
});

// todo 비즈니스 로직 관련 테스트 코드
// describe('비즈니스 로직 및 데이터 상태에 따른 처리 테스트', () => {
//     test("기존에 구매하지 않았던 강의만 구매할 수 있다. (실패)", () => {
//
//     });
//
//
//     test('인원 수 제한 있는 ', () => {
//
//     });
// });

// helper code
function createSampleOrderWithState(state) {
    return new Order(1, 1, 100000, state, now, now);
}
