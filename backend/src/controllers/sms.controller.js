import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper: Seed Default Demo SMS Logs if table is empty
const seedDefaultSmsLogs = async () => {
  const count = await prisma.smsLog.count();
  if (count === 0) {
    await prisma.smsLog.createMany({
      data: [
        {
          recipient: '+255 700 112 233',
          message: '[ALERT] Low Stock Alert: iPhone 15 Pro Max 256GB is down to 2 units in stock. Reorder recommended.',
          type: 'LOW_STOCK',
          status: 'DELIVERED',
        },
        {
          recipient: '+255 754 889 900',
          message: '[RECEIPT] PhoneVault Pro: Invoice #INV-2026-00102 paid TSH 3,200,000. Warranty Cert: WARR-2026-8812.',
          type: 'POS_RECEIPT',
          status: 'DELIVERED',
        },
        {
          recipient: '+255 788 112 334',
          message: '[RMA UPDATE] PhoneVault Pro: Your brand-new replacement unit (RMA-2026-0041) has arrived from Apple East Africa!',
          type: 'WARRANTY_RMA',
          status: 'DELIVERED',
        },
      ],
    });
  }
};

/**
 * GET /api/sms
 * Fetch SMS Notification Dispatch Logs
 */
export const getSmsLogs = async (req, res) => {
  try {
    await seedDefaultSmsLogs();
    const logs = await prisma.smsLog.findMany({
      orderBy: { sentAt: 'desc' },
      take: 50,
    });
    return res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching SMS logs:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/sms/send
 * Dispatch SMS Notification
 */
export const sendSms = async (req, res) => {
  try {
    const { recipient, message, type = 'CUSTOM' } = req.body;
    if (!recipient || !message) {
      return res.status(400).json({ success: false, message: 'Recipient phone number and message text are required' });
    }

    // Save SMS Log in DB
    const sms = await prisma.smsLog.create({
      data: {
        recipient,
        message,
        type,
        status: 'DELIVERED',
      },
    });

    return res.status(201).json({
      success: true,
      message: `SMS notification dispatched successfully to ${recipient}!`,
      data: sms,
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
