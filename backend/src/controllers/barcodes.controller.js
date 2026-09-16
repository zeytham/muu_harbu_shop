import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Generate Barcode Sticker Data payload for thermal printing
export const generateBarcodeSticker = async (req, res) => {
  try {
    const { code } = req.params;

    // Search by Barcode or SKU in Products, Variants, or IMEIs
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ barcode: code }, { sku: code }]
      },
      include: { category: true, brand: true }
    });

    if (product) {
      return res.json({
        success: true,
        type: 'PRODUCT',
        labelData: {
          title: product.name,
          subtitle: product.brand?.name || product.category.name,
          barcode: product.barcode || product.sku,
          price: product.basePrice ? `TSH ${product.basePrice.toLocaleString()}` : '',
          code: product.barcode || product.sku
        }
      });
    }

    const variant = await prisma.productVariant.findFirst({
      where: {
        OR: [{ barcode: code }, { sku: code }]
      },
      include: { product: { include: { brand: true, category: true } } }
    });

    if (variant) {
      return res.json({
        success: true,
        type: 'VARIANT',
        labelData: {
          title: variant.product.name,
          subtitle: `${variant.color || ''} ${variant.size || ''}`.trim(),
          barcode: variant.barcode || variant.sku,
          price: `TSH ${variant.price.toLocaleString()}`,
          code: variant.barcode || variant.sku
        }
      });
    }

    const phone = await prisma.phoneUnit.findFirst({
      where: {
        OR: [{ imei1: code }, { imei2: code }, { serialNumber: code }]
      },
      include: { product: true }
    });

    if (phone) {
      return res.json({
        success: true,
        type: 'IMEI',
        labelData: {
          title: phone.product.name,
          subtitle: `${phone.color} | ${phone.storage} | ${phone.condition}`,
          barcode: phone.imei1,
          price: `TSH ${phone.retailPrice.toLocaleString()}`,
          code: phone.imei1
        }
      });
    }

    res.status(404).json({ error: true, message: 'Item not found for code: ' + code });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
