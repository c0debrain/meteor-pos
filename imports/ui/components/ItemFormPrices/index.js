import "./index.scss";

import { Button, Form, Icon, Input, InputNumber, Table } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class ItemFormPrices extends Component {
    constructor() {
        super();
        this.removePrice = this.removePrice.bind(this);
        this.addPrice = this.addPrice.bind(this);
        this.checkDuplicateUnits = this.checkDuplicateUnits.bind(this);
    }

    addPrice() {
        const { itemForm } = this.props;
        const { getFieldValue, setFieldsValue } = itemForm;
        const priceCount = getFieldValue("priceCount");
        const itemPrices = getFieldValue("itemPrices") || [];
        setFieldsValue({
            priceCount: priceCount + 1,
            itemPrices: itemPrices.concat({
                itemPriceId: priceCount
            })
        });
    }

    removePrice(itemPriceId) {
        const { itemForm } = this.props;
        const { getFieldValue, setFieldsValue } = itemForm;
        const itemPrices = getFieldValue("itemPrices");
        setFieldsValue({
            itemPrices: itemPrices.filter(
                itemPrice => itemPrice.itemPriceId !== itemPriceId
            )
        });
    }

    checkDuplicateUnits(rule, unit, callback) {
        if (unit === undefined) callback();
        const { itemForm } = this.props;
        const baseUnit = itemForm.getFieldValue("baseUnit");
        const itemPrices = itemForm.getFieldValue("itemPrices") || [];
        let duplicateUnitCount = 0;
        baseUnit === unit && duplicateUnitCount++;
        itemPrices.forEach(itemPrice => {
            const { itemPriceId } = itemPrice;
            duplicateUnitCount +=
                itemForm.getFieldValue(`itemPrice-${itemPriceId}-unit`) === unit
                    ? 1
                    : 0;
        });
        if (duplicateUnitCount <= 1) callback();
        else callback(new Error(i18n.__("item-itemPrice-unit-duplicated")));
    }

    render() {
        const { itemForm } = this.props;

        const { getFieldDecorator, getFieldValue } = itemForm;

        const itemPrices = getFieldValue("itemPrices");

        const itemPricesDatasource = (itemPrices || []).map(itemPrice => {
            const { itemPriceId } = itemPrice;

            return {
                itemPriceId,
                delete: (
                    <Icon
                        className="item-price-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.removePrice(itemPriceId)}
                    />
                ),
                unit: (
                    <Form.Item>
                        {getFieldDecorator(`itemPrice-${itemPriceId}-unit`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "item-itemPrice-unit-required"
                                    )
                                },
                                {
                                    validator: this.checkDuplicateUnits
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "item-itemPrice-unit-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                ),
                price: (
                    <Form.Item>
                        {getFieldDecorator(`itemPrice-${itemPriceId}-price`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "item-itemPrice-price-required"
                                    )
                                },
                                {
                                    type: "number",
                                    min: 0,
                                    message: "Invalid price"
                                }
                            ]
                        })(
                            <InputNumber
                                style={{ width: "100%" }}
                                formatter={value =>
                                    `Rp ${value
                                        .toString()
                                        .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )}`}
                                parser={value =>
                                    value.toString().replace(/Rp\s?|(,*)/g, "")}
                                placeholder={i18n.__(
                                    "item-itemPrice-price-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                ),
                multiplier: (
                    <Form.Item>
                        {getFieldDecorator(
                            `itemPrice-${itemPriceId}-multiplier`,
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: i18n.__(
                                            "item-itemPrice-multiplier-required"
                                        )
                                    },
                                    {
                                        type: "number",
                                        min: 0.001,
                                        message: "Invalid multiplier"
                                    }
                                ]
                            }
                        )(
                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder={i18n.__(
                                    "item-itemPrice-multiplier-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                )
            };
        });

        const itemPricesTableProps = {
            title: () =>
                <Form.Item>
                    {getFieldDecorator("itemPrices")(
                        <span>
                            {i18n.__("item-itemPrices")}
                        </span>
                    )}
                </Form.Item>,
            rowKey: "itemPriceId",
            pagination: false,
            dataSource: itemPricesDatasource,
            columns: [
                {
                    title: i18n.__("item-unit"),
                    dataIndex: "unit",
                    key: "unit",
                    width: "30%"
                },
                {
                    title: i18n.__("item-price"),
                    dataIndex: "price",
                    key: "price",
                    width: "30%"
                },
                {
                    title: i18n.__("item-itemPrice-multiplier"),
                    dataIndex: "multiplier",
                    key: "multiplier",
                    width: "30%"
                },
                {
                    dataIndex: "delete",
                    key: "delete",
                    width: "10%"
                }
            ],
            scroll: { y: 200, x: 0 },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        return (
            <div>
                <Table {...itemPricesTableProps} />
                <Button
                    className="item-itemPrices-add-button"
                    type="dashed"
                    onClick={this.addPrice}
                >
                    <Icon type="plus" />
                    {i18n.__("item-add-item-price")}
                </Button>
            </div>
        );
    }
}

ItemFormPrices.propTypes = {
    itemForm: PropTypes.object
};

export default ItemFormPrices;
