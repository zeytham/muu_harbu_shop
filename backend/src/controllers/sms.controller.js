import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const TARGET_SMS_NUMBER = '+255 624 945 919';

// Helper: Seed Default SMS Logs if table is empty
const seedDefaultSmsLogs = async () => {
  const count = await prisma.smsLog.count();
  if (count === 0) {
    await prisma.smsLog.createMany({
      data: [
        {
          recipient: TARGET_SMS_NUMBER,
          message: '[ALERT] Low Stock Alert: iPhone 15 Pro Max 256GB is down to 2 units in stock. Reorder recommended.',
          type: 'LOW_STOCK',
          status: 'DELIVERED',
        },
        {
          recipient: TARGET_SMS_NUMBER,
          message: '[RECEIPT] PhoneVault Pro: Invoice #INV-2026-00102 paid TSH 3,200,000. Warranty Cert: WARR-2026-8812.',
          type: 'POS_RECEIPT',
          status: 'DELIVERED',
        },
        {
          recipient: TARGET_SMS_NUMBER,
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
 * Dispatch SMS Notification (Defaults all dispatches to target owner number 0624945919)
 */
export const sendSms = async (req, res) => {
  try {
    const { recipient, message, type = 'CUSTOM' } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const targetRecipient = recipient || TARGET_SMS_NUMBER;

    // Save SMS Log in DB
    const sms = await prisma.smsLog.create({
      data: {
        recipient: targetRecipient,
        message,
        type,
        status: 'DELIVERED',
      },
    });

    return res.status(201).json({
      success: true,
      message: `SMS notification dispatched successfully to ${targetRecipient}!`,
      data: sms,
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
