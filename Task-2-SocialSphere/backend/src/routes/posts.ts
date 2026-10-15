import { Router, Response } from 'express';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createPostSchema, commentSchema } from '../validators';

const router = Router();

// GET /api/posts/feed
router.get('/feed', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const followingIds = [...user.following.map(id => id.toString()), req.userId!];
    
    const posts = await Post.find({ author: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'username displayName avatar')
      .populate('comments.author', 'username displayName avatar');
    
    const total = await Post.countDocuments({ author: { $in: followingIds } });
    res.json({ posts, hasMore: page * limit < total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// GET /api/posts/explore
router.get('/explore', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'username displayName avatar')
      .populate('comments.author', 'username displayName avatar');
    const total = await Post.countDocuments();
    res.json({ posts, hasMore: page * limit < total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/search?q=query
router.get('/search', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.json({ posts: [] });
    const posts = await Post.find({ content: { $regex: query, $options: 'i' } })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('author', 'username displayName avatar')
      .populate('comments.author', 'username displayName avatar');
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/posts/user/:userId
router.get('/user/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username displayName avatar')
      .populate('comments.author', 'username displayName avatar');
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST /api/posts
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = createPostSchema.parse(req.body);
    const post = await Post.create({ ...data, author: req.userId });
    const populated = await post.populate('author', 'username displayName avatar');
    res.status(201).json({ post: populated });
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT /api/posts/:id
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ error: 'Not authorized' });
    const data = createPostSchema.parse(req.body);
    post.content = data.content;
    await post.save();
    const populated = await post.populate('author', 'username displayName avatar');
    res.json({ post: populated });
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ error: 'Not authorized' });
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// POST /api/posts/:id/like
router.post('/:id/like', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.likes.map(id => id.toString()).includes(req.userId!)) {
      return res.status(400).json({ error: 'Already liked' });
    }
    post.likes.push(req.userId as any);
    await post.save();

    if (post.author.toString() !== req.userId) {
      await Notification.create({
        user: post.author,
        type: 'like',
        from: req.userId,
        post: post._id,
        content: 'liked your post',
      });
      const io = req.app.get('io');
      io.to(post.author.toString()).emit('notification', { type: 'like', postId: post._id });
    }
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// POST /api/posts/:id/unlike
router.post('/:id/unlike', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.likes = post.likes.filter(id => id.toString() !== req.userId);
    await post.save();
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlike post' });
  }
});

// POST /api/posts/:id/comment
router.post('/:id/comment', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = commentSchema.parse(req.body);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments.push({ author: req.userId as any, content: data.content });
    await post.save();

    if (post.author.toString() !== req.userId) {
      await Notification.create({
        user: post.author,
        type: 'comment',
        from: req.userId,
        post: post._id,
        content: `commented: "${data.content.substring(0, 50)}"`,
      });
      const io = req.app.get('io');
      io.to(post.author.toString()).emit('notification', { type: 'comment', postId: post._id });
    }
    const populated = await post.populate('comments.author', 'username displayName avatar');
    res.json({ post: populated });
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// DELETE /api/posts/:id/comment/:commentId
router.delete('/:id/comment/:commentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.author.toString() !== req.userId) return res.status(403).json({ error: 'Not authorized' });
    post.comments.pull(req.params.commentId);
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
