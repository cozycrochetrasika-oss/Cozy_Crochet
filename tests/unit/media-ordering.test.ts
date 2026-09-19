import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getAllProducts } from '../../src/data/products';

describe('Media Pipeline 5-Slot Hierarchy', () => {
  const products = getAllProducts();

  test('all 7 products exist in catalog', () => {
    assert.strictEqual(products.length, 7, 'Expected 7 products in catalog');
  });

  for (const product of products) {
    test(`product "${product.name}" satisfies media slot ordering`, () => {
      const media = product.media;
      assert.ok(media.length >= 2, `Product ${product.name} should have at least 2 media items`);

      // Slot 1 must be main
      assert.strictEqual(
        media[0].slot,
        'main',
        `Slot 1 for ${product.name} must be "main", got "${media[0].slot}"`
      );

      // Slot 2 must be video if video exists
      const hasVideo = media.some((m) => m.mediaType === 'video');
      if (hasVideo) {
        assert.strictEqual(
          media[1].slot,
          'video',
          `Slot 2 for ${product.name} must be "video"`
        );
        assert.strictEqual(
          media[1].mediaType,
          'video',
          `Media item in slot 2 must be video`
        );
      }

      // If single exists, it should precede bundle and extra
      const singleIdx = media.findIndex((m) => m.slot === 'single');
      const bundleIdx = media.findIndex((m) => m.slot === 'bundle');
      const extraIdx = media.findIndex((m) => m.slot === 'extra');

      if (singleIdx > -1 && bundleIdx > -1) {
        assert.ok(
          singleIdx < bundleIdx,
          `Single (idx ${singleIdx}) should precede Bundle (idx ${bundleIdx}) for ${product.name}`
        );
      }

      if (singleIdx > -1 && extraIdx > -1) {
        assert.ok(
          singleIdx < extraIdx,
          `Single (idx ${singleIdx}) should precede Extra (idx ${extraIdx}) for ${product.name}`
        );
      }

      if (bundleIdx > -1 && extraIdx > -1) {
        assert.ok(
          bundleIdx < extraIdx,
          `Bundle (idx ${bundleIdx}) should precede Extra (idx ${extraIdx}) for ${product.name}`
        );
      }
    });
  }
});
