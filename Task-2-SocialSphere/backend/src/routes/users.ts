import { Router, Response } from 'express';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { authenticate, AuthRequest } from '../middleware/auth';
import { updateProfileSchema } from '../validators';

const router = Router();

// GET /api/users/search?q=query
router.get('/search', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.json({ users: [] });
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } },
      ],
    }).select('-password').limit(20);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/users/:username
router.get('/:username', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password').populate('followers', 'username displayName avatar').populate('following', 'username displayName avatar');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/users/profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.userId, data, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Update failed' });
  }
});

// POST /api/users/:id/follow
router.post('/:id/follow', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.userId) return res.status(400).json({ error: 'Cannot follow yourself' });
    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(targetId);
    if (!currentUser || !targetUser) return res.status(404).json({ error: 'User not found' });
    if (currentUser.following.includes(targetUser._id)) return res.status(400).json({ error: 'Already following' });
    
    currentUser.following.push(targetUser._id as any);
    targetUser.followers.push(currentUser._id as any);
    await currentUser.save();
    await targetUser.save();

    await Notification.create({
      user: targetId,
      type: 'follow',
      from: req.userId,
      content: 'started following you',
    });

    // Socket notification
    const io = req.app.get('io');
    io.to(targetId).emit('notification', { type: 'follow', from: currentUser });

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Follow failed' });
  }
});

// POST /api/users/:id/unfollow
router.post('/:id/unfollow', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const targetId = req.params.id;
    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(targetId);
    if (!currentUser || !targetUser) return res.status(404).json({ error: 'User not found' });
    
    currentUser.following = currentUser.following.filter(id => id.toString() !== targetId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.userId);
    await currentUser.save();
    await targetUser.save();
    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unfollow failed' });
  }
});

export default router;
