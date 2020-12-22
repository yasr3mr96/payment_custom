# -*- coding: utf-8 -*-

from odoo import models, fields, api


class PosPaymentMethod(models.Model):
    _inherit='pos.payment.method'

    customer_required = fields.Boolean(string="Customer Required")
    credit_order = fields.Boolean(string="Credit Order")

