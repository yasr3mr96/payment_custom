odoo.define('payment_custom.quick_payment', function (require) {
    "use strict";

    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const Registries = require('point_of_sale.Registries');
    const quick_models = require('point_of_sale.models');

    quick_models.load_fields('pos.payment.method', ['customer_required']);


    const custom_payment_screen = (PaymentScreen) => class extends PaymentScreen {

        async validateOrder(isForceValidate) {
            var customer_required = false;
            customer_required = this.env.pos.payment_methods_by_id[this.selectedPaymentLine.payment_method.id].customer_required
            if (customer_required && !this.currentOrder.get_client()) {
                const {confirmed} = await this.showPopup('ConfirmPopup', {
                    title: this.env._t('Please select the Customer'),
                    body: this.env._t(
                        'You need to select the customer before you can invoice an order.'
                    ),
                });
                if (confirmed) {
                    this.selectClient();
                }
                return false;
            }
            if (await this._isOrderValid(isForceValidate)) {
                // remove pending payments before finalizing the validation
                for (let line of this.paymentLines) {
                    if (!line.is_done()) this.currentOrder.remove_paymentline(line);
                }
                await this._finalizeValidation();
            }
            return super.validateOrder(...arguments);
        }


    };

    Registries.Component.extend(PaymentScreen, custom_payment_screen);


});