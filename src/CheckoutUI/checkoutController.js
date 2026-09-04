function buildCheckoutSummary(order) {
  return {
    orderId: order.id,
    customerId: order.customerId,
    total: order.total,
    status: 'confirmed'
  };
}

module.exports = { buildCheckoutSummary };
