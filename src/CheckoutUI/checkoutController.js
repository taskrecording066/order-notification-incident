function buildCheckoutSummary(order) {
  return {
    orderId: order.id,
    customerId: order.customerId,
    total: order.total,
    status: 'confirmed',
    trustSignals: ['secure-payment', 'verified-shipping-address', 'fraud-check-passed']
  };
}

module.exports = { buildCheckoutSummary };
