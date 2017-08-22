import {} from "../../graphql/queries/order";

import { ENTITYSTATUS, ORDERSTATUS, PAYMENTSTATUS } from "../../../constants";
import {
    changeOrderForm,
    changeOrderItemForm,
    changeOrdersPage,
    closeOrderForm,
    closeOrderItemForm,
    editOrderForm,
    editOrderItemForm,
    newOrderForm,
    newOrderItemForm,
    searchOrderCustomers,
    searchOrderItems,
    searchOrders
} from ".";

import ApolloClient from "apollo-client";
import { GETCUSTOMERS } from "../../graphql/queries/customer";
import { GETITEMS } from "../../graphql/queries/item";
import { GETORDER } from "../../graphql/queries/order";
import { ORDER } from "../actionTypes";
import configureMockStore from "redux-mock-store";
import expect from "expect";
import { mockNetworkInterface } from "apollo-test-utils";
import moment from "moment";
import thunk from "redux-thunk";

if (Meteor.isClient) {
    const orderDate = moment();
    const responseMocks = [
        {
            request: {
                query: GETORDER,
                variables: { _id: "" }
            },
            result: {
                data: {
                    order: {
                        _id: "",
                        orderNo: "",
                        orderDate: orderDate,
                        customerId: "",
                        customer: {
                            _id: "",
                            name: "",
                            address: "",
                            phoneNumber: "",
                            cellphoneNumber: ""
                        },
                        shipmentInfo: {
                            address: null,
                            phoneNumber: null,
                            cellphoneNumber: null
                        },
                        orderItems: [],
                        paidAmount: 0,
                        orderStatus: ORDERSTATUS.INPROGRESS,
                        paymentStatus: PAYMENTSTATUS.UNPAID,
                        entityStatus: ENTITYSTATUS.ACTIVE
                    }
                }
            }
        },
        {
            request: {
                query: GETCUSTOMERS,
                variables: {
                    pageSize: 10,
                    filter: {},
                    skip: 0
                }
            },
            result: {
                data: {
                    customers: [],
                    customerCount: 0
                }
            }
        },
        {
            request: {
                query: GETITEMS,
                variables: {
                    pageSize: 10,
                    filter: {},
                    skip: 0
                }
            },
            result: {
                data: {
                    items: [],
                    itemCount: 0
                }
            }
        }
    ];
    const client = new ApolloClient({
        networkInterface: mockNetworkInterface(...responseMocks),
        addTypename: false
    });
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({});

    beforeEach(function() {
        store.clearActions();
    });

    describe("Change order page action", function() {
        it("dispatched action has a type of ORDER.CHANGE_ORDER_PAGE", function() {
            const expectedActions = [
                {
                    type: ORDER.CHANGE_ORDER_PAGE,
                    payload: { current: 1 }
                }
            ];

            store.dispatch(changeOrdersPage({ current: 1 }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Search orders action", function() {
        it("dispatched action has a type of ORDER.SEARCH_ORDERS", function() {
            const expectedActions = [
                {
                    type: ORDER.SEARCH_ORDERS,
                    payload: { filter: {} }
                }
            ];

            store.dispatch(searchOrders({ filter: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("New order form action", function() {
        it("dispatched action has a ORDER of ORDER.ORDER_FORM_OPEN", function() {
            const expectedActions = [ORDER.ORDER_FORM_OPEN];

            store.dispatch(newOrderForm());

            expect(store.getActions().map(action => action.type)).toEqual(
                expectedActions
            );
        });
    });

    describe("Edit order form action", function() {
        it("dispatched action has a ORDER of ORDER.ORDER_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: ORDER.ORDER_FORM_OPEN,
                    payload: {
                        order: {
                            _id: "",
                            orderNo: "",
                            orderDate: orderDate,
                            customerId: "",
                            customer: {
                                _id: "",
                                name: "",
                                address: "",
                                phoneNumber: "",
                                cellphoneNumber: ""
                            },
                            shipmentInfo: {
                                address: null,
                                phoneNumber: null,
                                cellphoneNumber: null
                            },
                            orderItems: [],
                            paidAmount: 0,
                            orderStatus: ORDERSTATUS.INPROGRESS,
                            paymentStatus: PAYMENTSTATUS.UNPAID,
                            entityStatus: ENTITYSTATUS.ACTIVE
                        },
                        isNew: false
                    }
                }
            ];

            return store
                .dispatch(editOrderForm({ client, _id: "" }))
                .then(function() {
                    expect(store.getActions()).toEqual(expectedActions);
                });
        });
    });

    describe("Close order form action", function() {
        it("dispatched action has a type of ORDER.ORDER_FORM_CLOSE", function() {
            const expectedActions = [
                {
                    type: ORDER.ORDER_FORM_CLOSE
                }
            ];

            store.dispatch(closeOrderForm());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Change order form action", function() {
        it("dispatched action has a type of ORDER.ORDER_FORM_CHANGED", function() {
            const expectedActions = [
                {
                    type: ORDER.ORDER_FORM_CHANGED,
                    payload: { order: {} }
                }
            ];

            store.dispatch(changeOrderForm({ order: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Refresh order customers action", function() {
        it("dispatched action has a type of ORDER.REFRESH_CUSTOMERS", function() {
            const expectedActions = [
                {
                    type: ORDER.REFRESH_CUSTOMERS,
                    payload: { customers: [] }
                }
            ];

            return store
                .dispatch(searchOrderCustomers({ client, filter: {} }))
                .then(() =>
                    expect(store.getActions()).toEqual(expectedActions)
                );
        });
    });

    describe("Refresh order items action", function() {
        it("dispatched action has a type of ORDER.REFRESH_ITEMS", function() {
            const expectedActions = [
                {
                    type: ORDER.REFRESH_ITEMS,
                    payload: { items: [] }
                }
            ];

            return store
                .dispatch(searchOrderItems({ client, filter: {} }))
                .then(() =>
                    expect(store.getActions()).toEqual(expectedActions)
                );
        });
    });

    describe("New order item form action", function() {
        it("dispatched action has a ORDER of ORDER.ORDER_ITEM_FORM_OPEN", function() {
            const expectedActions = [
                { type: ORDER.ORDER_ITEM_FORM_OPEN, payload: { isNew: true } }
            ];

            store.dispatch(newOrderItemForm());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Edit order item form action", function() {
        it("dispatched action has a ORDER of ORDER.ORDER_ITEM_FORM_OPEN", function() {
            const expectedActions = [
                {
                    type: ORDER.ORDER_ITEM_FORM_OPEN,
                    payload: { isNew: false, itemId: "" }
                }
            ];

            store.dispatch(editOrderItemForm({ itemId: "" }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Close order item form action", function() {
        it("dispatched action has a ORDER of ORDER.ORDER_ITEM_FORM_CLOSE", function() {
            const expectedActions = [{ type: ORDER.ORDER_ITEM_FORM_CLOSE }];

            store.dispatch(closeOrderItemForm());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe("Change order item form action", function() {
        it("dispatched action has a ORDER of ORDER.ORDER_ITEM_FORM_CHANGED", function() {
            const expectedActions = [
                {
                    type: ORDER.ORDER_ITEM_FORM_CHANGED,
                    payload: { orderItem: {} }
                }
            ];

            store.dispatch(changeOrderItemForm({ orderItem: {} }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
}
