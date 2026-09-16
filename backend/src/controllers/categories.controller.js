import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } }
      },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
        phoneModels: true
      },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const getPhoneModels = async (req, res) => {
  try {
    const models = await prisma.phoneModel.findMany({
      include: { brand: true },
      orderBy: { modelName: 'asc' }
    });
    res.json({ success: true, data: models });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
