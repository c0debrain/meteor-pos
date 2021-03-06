import {
    CREATESUPPLIER,
    UPDATESUPPLIER
} from "../../graphql/mutations/supplier";
import { Form, Input, Modal } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import i18n from "meteor/universe:i18n";

@graphql(CREATESUPPLIER, {
    name: "createSupplier"
})
@graphql(UPDATESUPPLIER, {
    name: "updateSupplier"
})
class SupplierForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
    }

    onOk() {
        const {
            form,
            createSupplier,
            updateSupplier,
            isNew,
            closeSupplierForm
        } = this.props;
        const { getFieldValue } = form;

        form.validateFields((errors, supplier) => {
            if (!errors) {
                const mutation = isNew
                    ? props => {
                          return createSupplier(props);
                      }
                    : props => {
                          return updateSupplier(props);
                      };
                mutation({
                    variables: {
                        supplier: {
                            ...supplier
                        }
                    }
                })
                    .then(() => closeSupplierForm())
                    .catch(err => {
                        console.error(err);
                        Modal.error({ title: i18n.__("supplier-save-failed") });
                    });
            }
        });
    }

    render() {
        const { form, visible, closeSupplierForm, isNew } = this.props;
        const { getFieldDecorator, getFieldValue } = form;

        const modalProps = {
            title: i18n.__(isNew ? "supplier-add" : "supplier-update"),
            visible,
            onCancel: closeSupplierForm,
            okText: i18n.__(isNew ? "create" : "update"),
            cancelText: i18n.__("cancel"),
            onOk: this.onOk,
            width: "30%",
            maskClosable: false
        };

        const formItemProps = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 }
        };

        return (
            <Modal {...modalProps}>
                <Form onSubmit={this.onOk}>
                    <Form.Item>
                        {getFieldDecorator("_id")(
                            <Input style={{ display: "none" }} />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemProps}
                        label={i18n.__("supplier-name")}
                        hasFeedback
                    >
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__("supplier-name-required")
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "supplier-name-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemProps}
                        label={i18n.__("supplier-address")}
                        hasFeedback
                    >
                        {getFieldDecorator("address", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "supplier-address-required"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "supplier-address-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemProps}
                        label={i18n.__("supplier-phoneNumber")}
                        hasFeedback
                    >
                        {getFieldDecorator("phoneNumber", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "supplier-phoneNumber-required"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "supplier-phoneNumber-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemProps}
                        label={i18n.__("supplier-cellphoneNumber")}
                        hasFeedback
                    >
                        {getFieldDecorator("cellphoneNumber", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "supplier-cellphoneNumber-required"
                                    )
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "supplier-cellphoneNumber-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

SupplierForm.propTypes = {
    form: PropTypes.object,
    isNew: PropTypes.bool,
    closeSupplierForm: PropTypes.func,
    visible: PropTypes.bool
};

const mapPropsToFields = ({ editingSupplier }) => {
    const {
        _id,
        name,
        address,
        phoneNumber,
        cellphoneNumber
    } = editingSupplier;

    return {
        _id: {
            value: _id
        },
        name: {
            value: name
        },
        address: {
            value: address
        },
        phoneNumber: {
            value: phoneNumber
        },
        cellphoneNumber: { value: cellphoneNumber }
    };
};

const onValuesChange = (props, supplier) => {
    const { changeSupplierForm } = props;
    changeSupplierForm({ supplier });
};

export default Form.create({ mapPropsToFields, onValuesChange })(SupplierForm);
