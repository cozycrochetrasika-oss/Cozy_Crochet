import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { useCartStore } from '../../src/store/cart-store';
import { getProductBySlug } from '../../src/data/products';

describe('Cart Store & Inventory Capping', () => {
  const bouquet = getProductBySlug('crochet-bouquet');
  assert.ok(bouquet, 'Crochet Bouquet must exist');

  test('item addition within inventory limits succeeds', () => {
    useCartStore.getState().clearCart();

    const result = useCartStore.getState().addItem(bouquet, 2);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.addedCount, 2);
    assert.strictEqual(useCartStore.getState().getTotalItems(), 2);
  });

  test('item addition exceeding available inventory is strictly clamped', () => {
    useCartStore.getState().clearCart();

    const maxInventory = bouquet.inventoryQty; // e.g. 14
    // Attempt to add way more than inventory
    const result = useCartStore.getState().addItem(bouquet, maxInventory + 50);

    const cartItems = useCartStore.getState().items;
    const itemInCart = cartItems.find((i) => i.product.id === bouquet.id);

    assert.ok(itemInCart, 'Item should be present in cart');
    assert.strictEqual(
      itemInCart.quantity,
      maxInventory,
      `Quantity should be clamped to max inventory (${maxInventory})`
    );
  });

  test('updateQuantity exceeding inventory is clamped', () => {
    useCartStore.getState().clearCart();
    useCartStore.getState().addItem(bouquet, 1);

    const maxInventory = bouquet.inventoryQty;
    const updateResult = useCartStore.getState().updateQuantity(bouquet.id, 999);

    assert.strictEqual(updateResult.clampedQuantity, maxInventory);

    const item = useCartStore.getState().items.find((i) => i.product.id === bouquet.id);
    assert.strictEqual(item?.quantity, maxInventory);
  });
});
