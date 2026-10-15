import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { authenticate, generateToken, AuthRequest } from '../middleware/auth';
import { registerSchema, loginSchema } from '../validators';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const existingUser = await User.findOne({ $or: [{ email: data.email }, { username: data.username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already taken' });
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await User.create({ ...data, password: hashedPassword });
    const token = generateToken(user._id.toString());
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, displayName: user.displayName, email: user.email, bio: user.bio, avatar: user.avatar, followers: user.followers, following: user.following },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken(user._id.toString());
    res.json({
      token,
      user: { id: user._id, username: user.username, displayName: user.displayName, email: user.email, bio: user.bio, avatar: user.avatar, followers: user.followers, following: user.following },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
