import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get accessories compatible with a specific phone model
export const getCompatibleAccessories = async (req, res) => {
  try {
    const { phoneModelId, search } = req.query;

    const where = {};
    if (phoneModelId) {
      where.OR = [
        { compatibilities: { some: { phoneModelId } } },
        { compatibilities: { some: { isUniversal: true } } },
      ];
    }

    if (search) {
      where.name = { contains: search };
    }

    const accessories = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        variants: true,
        compatibilities: {
          include: { phoneModel: true }
        }
      }
    });

    const formatted = accessories.map(a => ({
      ...a,
      imageUrls: a.imageUrls ? JSON.parse(a.imageUrls) : [],
      specifications: a.specifications ? JSON.parse(a.specifications) : {},
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
