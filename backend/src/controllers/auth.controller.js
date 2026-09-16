import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Helper: Seed Default Admin User if User table is empty
const seedDefaultAdmin = async () => {
  const count = await prisma.user.count();
  if (count === 0) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        name: 'Store Owner / Manager',
        email: 'admin@phonevault.tz',
        password: hashedPassword,
        pin: '1234',
        role: 'ADMIN',
      },
    });
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    await seedDefaultAdmin();

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: true, message: 'Taarifa za kuingia sio sahihi (Invalid credentials)' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: true, message: 'Password sio sahihi (Invalid password)' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'phonevault_secret_key_2026',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        pin: user.pin,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

/**
 * POST /api/auth/unlock-pin
 * Verify Owner 4-digit PIN for quick screen unlocking
 */
export const unlockWithPin = async (req, res) => {
  try {
    await seedDefaultAdmin();

    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ success: false, message: 'PIN is required' });
    }

    const user = await prisma.user.findFirst({
      where: { pin: String(pin).padStart(4, '0') },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'PIN sio sahihi! (Invalid 4-digit PIN)' });
    }

    return res.json({
      success: true,
      message: 'PIN verified successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('PIN verification error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
