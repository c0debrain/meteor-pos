import {
    CREATECATEGORY,
    UPDATECATEGORY
} from "../../graphql/mutations/category";
import { Form, Input, Modal } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import i18n from "meteor/universe:i18n";

@graphql(CREATECATEGORY, {
    name: "createCategory"
})
@graphql(UPDATECATEGORY, {
    name: "updateCategory"
})
class CategoryForm extends Component {
    constructor() {
        super();
        this.onOk = this.onOk.bind(this);
    }

    onOk() {
        const {
            form,
            createCategory,
            updateCategory,
            isNew,
            closeCategoryForm
        } = this.props;
        const { getFieldValue } = form;

        form.validateFields((errors, category) => {
            if (!errors) {
                const mutation = isNew
                    ? props => {
                          return createCategory(props);
                      }
                    : props => {
                          return updateCategory(props);
                      };
                mutation({
                    variables: {
                        category: {
                            ...category
                        }
                    }
                })
                    .then(() => closeCategoryForm())
                    .catch(err => {
                        console.error(err);
                        Modal.error({ title: i18n.__("category-save-failed") });
                    });
            }
        });
    }

    render() {
        const { form, visible, closeCategoryForm, isNew } = this.props;
        const { getFieldDecorator, getFieldValue } = form;

        const modalProps = {
            title: i18n.__(isNew ? "category-add" : "category-update"),
            visible,
            onCancel: closeCategoryForm,
            okText: i18n.__(isNew ? "create" : "update"),
            cancelText: i18n.__("cancel"),
            onOk: this.onOk,
            width: 400,
            maskClosable: false
        };

        const formItemProps = {
            labelCol: { span: 6 },
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
                        label={i18n.__("category-name")}
                        hasFeedback
                    >
                        {getFieldDecorator("name", {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__("category-name-required")
                                }
                            ]
                        })(
                            <Input
                                placeholder={i18n.__(
                                    "category-name-placeholder"
                                )}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

CategoryForm.propTypes = {
    form: PropTypes.object,
    closeCategoryForm: PropTypes.func,
    isNew: PropTypes.bool,
    visible: PropTypes.bool
};

const mapPropsToFields = ({ editingCategory }) => {
    const { _id, name } = editingCategory;

    return {
        _id: {
            value: _id
        },
        name: {
            value: name
        }
    };
};

const onValuesChange = (props, category) => {
    const { changeCategoryForm } = props;
    changeCategoryForm({ category });
};

export default Form.create({ mapPropsToFields, onValuesChange })(CategoryForm);
