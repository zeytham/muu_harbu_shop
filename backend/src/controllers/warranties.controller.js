import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get All Digital Warranty Certificates
export const getWarrantyCertificates = async (req, res) => {
  try {
    const certificates = await prisma.warrantyCertificate.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: certificates.length, data: certificates });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Create Digital Warranty Certificate (Auto-called on POS sale or manual)
export const createWarrantyCertificate = async (req, res) => {
  try {
    const {
      saleId,
      phoneUnitId,
      customerName,
      customerPhone,
      imei1,
      modelName,
      warrantyMonths = 12,
    } = req.body;

    if (!customerName || !customerPhone || !imei1 || !modelName) {
      return res.status(400).json({ error: true, message: 'Customer details, IMEI, and Model Name are required' });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(warrantyMonths));

    const certificateCode = `WARR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const cert = await prisma.warrantyCertificate.create({
      data: {
        certificateCode,
        saleId: saleId || null,
        phoneUnitId: phoneUnitId || null,
        customerName,
        customerPhone,
        imei1,
        modelName,
        warrantyMonths: parseInt(warrantyMonths),
        startDate,
        endDate,
        status: 'ACTIVE',
      }
    });

    res.status(201).json({ success: true, message: 'Digital Warranty Certificate issued!', data: cert });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Search & Verify Warranty by IMEI or Certificate Code
export const verifyWarrantyByImei = async (req, res) => {
  try {
    const { term } = req.params;
    const cert = await prisma.warrantyCertificate.findFirst({
      where: {
        OR: [
          { imei1: term },
          { certificateCode: term },
          { customerPhone: term }
        ]
      }
    });

    if (!cert) {
      return res.status(404).json({ error: true, message: `No active warranty certificate found for: ${term}` });
    }

    // Calculate remaining days
    const now = new Date();
    const end = new Date(cert.endDate);
    const diffTime = end.getTime() - now.getTime();
    const remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const isExpired = remainingDays === 0;

    res.json({
      success: true,
      data: {
        ...cert,
        remainingDays,
        isExpired,
        coverageStatus: isExpired ? 'EXPIRED' : 'ACTIVE_VALID',
      }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Create Supplier RMA Claim (Returning Factory Defective Sealed Phone to Official Supplier)
export const createSupplierRmaClaim = async (req, res) => {
  try {
    const {
      warrantyCode,
      customerName,
      customerPhone,
      defectiveImei,
      supplierName,
      faultDescription,
    } = req.body;

    if (!defectiveImei || !supplierName || !faultDescription) {
      return res.status(400).json({ error: true, message: 'Defective IMEI, Supplier Name, and Fault Description are mandatory' });
    }

    const rmaNumber = `RMA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const rma = await prisma.supplierRmaClaim.create({
      data: {
        rmaNumber,
        warrantyCode: warrantyCode || 'N/A',
        customerName: customerName || 'Store Warranty Customer',
        customerPhone: customerPhone || 'N/A',
        defectiveImei,
        supplierName,
        faultDescription,
        status: 'DEFECT_REPORTED',
      }
    });

    // Update warranty certificate status if code provided
    if (warrantyCode) {
      await prisma.warrantyCertificate.updateMany({
        where: { certificateCode: warrantyCode },
        data: { status: 'CLAIMED_RMA' }
      });
    }

    res.status(201).json({ success: true, message: 'Supplier RMA Claim logged successfully', data: rma });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Get All Supplier RMA Replacement Claims
export const getSupplierRmaClaims = async (req, res) => {
  try {
    const claims = await prisma.supplierRmaClaim.findMany({
      orderBy: { dispatchedAt: 'desc' }
    });

    res.json({ success: true, count: claims.length, data: claims });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Resolve Supplier RMA Claim (Logging Brand New Sealed Replacement Unit IMEI)
export const resolveSupplierRmaClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { replacementImei, replacementModel, status } = req.body;

    const rma = await prisma.supplierRmaClaim.findUnique({ where: { id } });
    if (!rma) {
      return res.status(404).json({ error: true, message: 'RMA Claim record not found' });
    }

    const updated = await prisma.supplierRmaClaim.update({
      where: { id },
      data: {
        replacementImei: replacementImei || rma.replacementImei,
        replacementModel: replacementModel || rma.replacementModel,
        status: status || 'NEW_UNIT_DELIVERED',
        resolvedAt: new Date(),
      }
    });

    res.json({ success: true, message: 'Supplier RMA Claim resolved with Brand New Sealed Replacement Unit!', data: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// Executive Module 4 Analytics
export const getWarrantyAnalytics = async (req, res) => {
  try {
    const [certificates, rmaClaims] = await Promise.all([
      prisma.warrantyCertificate.findMany(),
      prisma.supplierRmaClaim.findMany(),
    ]);

    const activeCerts = certificates.filter(c => new Date(c.endDate) > new Date());
    const expiredCerts = certificates.filter(c => new Date(c.endDate) <= new Date());

    const supplierCounts = {};
    rmaClaims.forEach(r => {
      supplierCounts[r.supplierName] = (supplierCounts[r.supplierName] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalCertificates: certificates.length,
        activeWarranties: activeCerts.length,
        expiredWarranties: expiredCerts.length,
        totalRmaClaims: rmaClaims.length,
        resolvedSwaps: rmaClaims.filter(r => r.status === 'NEW_UNIT_DELIVERED').length,
        supplierCounts,
      }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
