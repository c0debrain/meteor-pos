import commands from "../../../domain/Customer/commands";

const {
    CreateCustomer,
    UpdateCustomer,
    ActivateCustomer,
    InactivateCustomer
} = commands;

const CustomerApi = Space.messaging.Api.extend("CustomerApi", {
    dependencies: {
        injector: "Injector",
        log: "log"
    },

    methods() {
        return [
            {
                [CreateCustomer]: this._createCustomer,
                [UpdateCustomer]: this._updateCustomer,
                [ActivateCustomer]: this._activateCustomer,
                [InactivateCustomer]: this._inactivateCustomer
            }
        ];
    },

    _createCustomer(context, command) {
        this.commandBus.send(command);
    },

    _updateCustomer(context, command) {
        this.commandBus.send(command);
    },

    _activateCustomer(context, command) {
        this.commandBus.send(command);
    },

    _inactivateCustomer(context, command) {
        this.commandBus.send(command);
    }
});

export default CustomerApi;
