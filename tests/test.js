import Order, {cancelOrder, completeCancel, completeOrder, ORDER_STATE} from "../app/models/Order.js"
import StateError from "../app/error/StateError.js";

// 상태 의존성 확인 테스트 : STARTED, PAID, CANCEL_REQUESTED, CANCEL_COMPLETED (, REFUND_REQUESTED, REFUND_COMPLETED)

/*
* [주문/결제 도메인 개요]
* 1. 주문은 [STARTED, PAID, CANCEL_REQUESTED, CANCEL_COMPLETED] 와 같은 상태를 가진다.
* 2. 주문 상태는 이전 상태에 대해 의존성을 갖는다.
*   1) PAID 이전 상태는 STARTED 이어야 한다.
*   2) CANCEL_REQUESTED 이전 상태는 PAID 이어야 한다.
*   3) CANCEL_COMPLETED 이전 상태는 CANCEL_REQUESTED 이어야 한다.
* 3. 다음의 경우
* */


let now;

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

function createSampleOrderWithState(state) {
    return new Order(1, 1, 100000, state, now, now);
}








// 1-1. 주문 시작 성공
// 1-2. 주문 시작 실패
// 1-3. 주문 완료 성공
// 1-4. 주문 완료 실패
// 2-1. 주문 취소 성공
// 2-2. 주문 취소 실패










// test('test', () => {
//     console.log("test")
//     expect(2 * 2).toEqual(4);
// });
