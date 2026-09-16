import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
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
        phoneModels: true,
      },
      orderBy: { name: 'asc' },
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
      orderBy: { modelName: 'asc' },
    });
    res.json({ success: true, data: models });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) return res.status(400).json({ error: true, message: 'Category name is required' });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `cat-${Date.now()}`;

    const category = await prisma.category.upsert({
      where: { slug },
      update: { name, description, icon },
      create: { name, slug, description, icon },
    });
    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const createBrand = async (req, res) => {
  try {
    const { name, logo } = req.body;
    if (!name) return res.status(400).json({ error: true, message: 'Brand name is required' });

    const brand = await prisma.brand.upsert({
      where: { name },
      update: { logo },
      create: { name, logo },
    });
    res.status(201).json({ success: true, message: 'Brand created successfully', data: brand });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const createPhoneModel = async (req, res) => {
  try {
    const { brandId, modelName, modelCode, releaseYear, screenSize } = req.body;
    if (!modelName || !brandId) {
      return res.status(400).json({ error: true, message: 'Brand and Model Name are required' });
    }

    const model = await prisma.phoneModel.create({
      data: {
        brandId,
        modelName,
        modelCode: modelCode || null,
        releaseYear: releaseYear ? parseInt(releaseYear) : null,
        screenSize: screenSize || null,
      },
      include: { brand: true },
    });

    // Also auto-create or find Smartphone Category & Product if not exists
    let cat = await prisma.category.findFirst({ where: { slug: 'smartphones' } });
    if (!cat) {
      cat = await prisma.category.create({
        data: { name: 'Smartphones & Tablets', slug: 'smartphones', icon: 'Smartphone' },
      });
    }

    const product = await prisma.product.create({
      data: {
        name: modelName,
        type: 'PHONE',
        categoryId: cat.id,
        brandId,
        description: `Smartphone model: ${modelName}`,
        hasVariants: false,
      },
      include: { brand: true, category: true },
    });

    res.status(201).json({
      success: true,
      message: 'Phone model & catalog product created successfully',
      data: { model, product },
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
