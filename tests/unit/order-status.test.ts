import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { useOrdersStore } from '../../src/store/orders-store';

describe('Order Status Decoupling Architecture', () => {
  test('payment_status and fulfilment_status are independent', async () => {
    const orderId = await useOrdersStore.getState().addOrder({
      orderNumber: 'CC-TEST-01',
      customerName: 'Test Buyer',
      email: 'test@example.com',
      phone: '+91 99999 88888',
      city: 'Delhi',
      addressLine1: 'Test Address',
      state: 'Delhi',
      postalCode: '110001',
      items: [{ productId: 'test_1', name: 'Item', quantity: 1, pricePaise: 99900 }],
      totalPaise: 99900,
      paymentProvider: 'upi_manual',
      paymentStatus: 'payment_review',
      fulfilmentStatus: 'processing',
    });

    const getOrder = () =>
      useOrdersStore.getState().orders.find((o) => o.id === orderId)!;

    // Initially: payment_review, processing
    assert.strictEqual(getOrder().paymentStatus, 'payment_review');
    assert.strictEqual(getOrder().fulfilmentStatus, 'processing');

    // Update payment_status to 'paid'
    useOrdersStore.getState().updatePaymentStatus(orderId, 'paid');
    assert.strictEqual(getOrder().paymentStatus, 'paid');
    // fulfilmentStatus remains processing (decoupled)
    assert.strictEqual(getOrder().fulfilmentStatus, 'processing');

    // Update fulfilment_status to 'shipped'
    useOrdersStore.getState().updateFulfilmentStatus(orderId, 'shipped');
    assert.strictEqual(getOrder().fulfilmentStatus, 'shipped');
    assert.strictEqual(getOrder().paymentStatus, 'paid');

    // Update payment_status to 'refunded'
    useOrdersStore.getState().updatePaymentStatus(orderId, 'refunded');
    assert.strictEqual(getOrder().paymentStatus, 'refunded');
    // fulfilmentStatus is not overridden
    assert.strictEqual(getOrder().fulfilmentStatus, 'shipped');
  });
});
