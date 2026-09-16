import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper: Seed Default StoreSetting if not exists
const getOrCreateDefaultSettings = async () => {
  let settings = await prisma.storeSetting.findUnique({
    where: { id: 'default' },
  });

  if (!settings) {
    settings = await prisma.storeSetting.create({
      data: {
        id: 'default',
        shopName: 'PhoneVault Pro Enterprise',
        shopPhone: '+255 700 112 233',
        shopEmail: 'info@phonevault.tz',
        shopAddress: 'Kariakoo Commercial Complex, Dar es Salaam',
        tinNumber: '123-456-789',
        vrnNumber: '40-012345-X',
        currency: 'TSH',
        exchangeRate: 2650.0,
        taxRate: 18.0,
        receiptHeader: 'Karibu PhoneVault Pro - Quality Guaranteed!',
        receiptFooter: 'Asante kwa kununua nasi! Warranty Certificate Included.',
      },
    });
  }
  return settings;
};

/**
 * GET /api/settings
 * Fetch global store settings (Shop name, TIN/VRN, address, tax rate, exchange rate, receipt text)
 */
export const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateDefaultSettings();
    return res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/settings
 * Update global store settings
 */
export const updateSettings = async (req, res) => {
  try {
    const {
      shopName,
      shopPhone,
      shopEmail,
      shopAddress,
      tinNumber,
      vrnNumber,
      currency,
      exchangeRate,
      taxRate,
      receiptHeader,
      receiptFooter,
    } = req.body;

    await getOrCreateDefaultSettings();

    const updated = await prisma.storeSetting.update({
      where: { id: 'default' },
      data: {
        shopName: shopName || 'PhoneVault Pro Enterprise',
        shopPhone,
        shopEmail,
        shopAddress,
        tinNumber,
        vrnNumber,
        currency: currency || 'TSH',
        exchangeRate: exchangeRate ? parseFloat(exchangeRate) : 2650.0,
        taxRate: taxRate !== undefined ? parseFloat(taxRate) : 18.0,
        receiptHeader,
        receiptFooter,
      },
    });

    return res.json({
      success: true,
      message: 'Store settings updated successfully across the entire system!',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/settings/security
 * Change Owner Password and Manager PIN
 */
export const updateSecurityCredentials = async (req, res) => {
  try {
    const { currentPassword, newPassword, newPin, email = 'admin@phonevault.tz' } = req.body;

    let user = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!user) {
      // Seed default admin if user table empty
      const hashedPassword = await bcrypt.hash(newPassword || 'password123', 10);
      user = await prisma.user.create({
        data: {
          name: 'Store Owner / Manager',
          email: 'admin@phonevault.tz',
          password: hashedPassword,
          pin: newPin || '1234',
          role: 'ADMIN',
        },
      });
      return res.json({ success: true, message: 'Owner credentials initialized!' });
    }

    const updateData = {};
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }
    if (newPin) {
      updateData.pin = String(newPin).padStart(4, '0');
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return res.json({
      success: true,
      message: 'Security Password & Manager PIN updated successfully!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        pin: updatedUser.pin,
      },
    });
  } catch (error) {
    console.error('Error updating security credentials:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/settings/export-backup
 * 1-Click Database Dump Backup Export
 */
export const exportDatabaseBackup = async (req, res) => {
  try {
    const [products, phoneUnits, categories, sales, expenses, suppliers, pos] = await Promise.all([
      prisma.product.findMany({ include: { variants: true } }),
      prisma.phoneUnit.findMany(),
      prisma.category.findMany(),
      prisma.sale.findMany({ include: { items: true, payments: true } }),
      prisma.storeExpense.findMany(),
      prisma.supplier.findMany(),
      prisma.purchaseOrder.findMany({ include: { items: true } }),
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      shop: await getOrCreateDefaultSettings(),
      inventory: {
        productsCount: products.length,
        phoneUnitsCount: phoneUnits.length,
        categoriesCount: categories.length,
        products,
        phoneUnits,
      },
      sales: {
        salesCount: sales.length,
        sales,
      },
      expenses: {
        expensesCount: expenses.length,
        expenses,
      },
      suppliers: {
        suppliersCount: suppliers.length,
        suppliers,
        purchaseOrders: pos,
      },
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=PhoneVault_Backup_${Date.now()}.json`);
    return res.send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    console.error('Error exporting backup:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
