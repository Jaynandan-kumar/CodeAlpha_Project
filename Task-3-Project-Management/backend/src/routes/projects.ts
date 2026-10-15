import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { authMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.userId': userId }],
      archived: { $ne: true },
    })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('owner', 'name email')
      .populate('members.userId', 'name email');

    const total = await Project.countDocuments({
      $or: [{ owner: userId }, { 'members.userId': userId }],
      archived: { $ne: true },
    });

    res.json({
      projects,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, status, priority, startDate, dueDate } = req.body;
    const userId = req.user!._id;

    if (!name || name.trim().length < 2) {
      throw new AppError('Project name is required (min 2 characters)', 400);
    }

    const project = new Project({
      name: name.trim(),
      description: description || '',
      owner: userId,
      members: [{ userId, role: 'owner', joinedAt: new Date() }],
      status: status || 'planning',
      priority: priority || 'medium',
      startDate: startDate || new Date(),
      dueDate: dueDate || undefined,
    });

    await project.save();
    await project.populate('owner', 'name email');

    res.status(201).json({ project });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.userId', 'name email');

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const userId = req.user!._id;
    const isMember = project.owner.toString() === userId.toString() ||
      project.members.some(m => m.userId.toString() === userId.toString());

    if (!isMember) {
      throw new AppError('Access denied', 403);
    }

    res.json({ project });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// PATCH /api/projects/:id
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new AppError('Project not found', 404);

    const userId = req.user!._id;
    const isOwnerOrAdmin = project.owner.toString() === userId.toString() ||
      project.members.some(m => m.userId.toString() === userId.toString() && (m.role === 'admin' || m.role === 'owner'));

    if (!isOwnerOrAdmin) throw new AppError('Permission denied', 403);

    const allowedUpdates = ['name', 'description', 'status', 'priority', 'startDate', 'dueDate'];
    allowedUpdates.forEach(key => {
      if (req.body[key] !== undefined) {
        (project as any)[key] = req.body[key];
      }
    });

    await project.save();
    res.json({ project });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new AppError('Project not found', 404);

    if (project.owner.toString() !== req.user!._id.toString()) {
      throw new AppError('Only the owner can delete projects', 403);
    }

    // Delete associated tasks
    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(project._id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// POST /api/projects/:id/members
router.post('/:id/members', async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) throw new AppError('Project not found', 404);

    const userId = req.user!._id;
    if (project.owner.toString() !== userId.toString()) {
      throw new AppError('Only the owner can add members', 403);
    }

    const memberUser = await User.findOne({ email: email?.toLowerCase() });
    if (!memberUser) throw new AppError('User not found with that email', 404);

    if (project.members.some(m => m.userId.toString() === memberUser._id.toString())) {
      throw new AppError('User is already a member', 409);
    }

    project.members.push({
      userId: memberUser._id,
      role: role || 'member',
      joinedAt: new Date(),
    });

    await project.save();
    await project.populate('members.userId', 'name email');

    res.json({ project });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// DELETE /api/projects/:id/members/:userId
router.delete('/:id/members/:userId', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new AppError('Project not found', 404);

    if (project.owner.toString() !== req.user!._id.toString()) {
      throw new AppError('Only the owner can remove members', 403);
    }

    if (req.params.userId === project.owner.toString()) {
      throw new AppError('Cannot remove the owner', 400);
    }

    project.members = project.members.filter(
      m => m.userId.toString() !== req.params.userId
    );

    await project.save();
    res.json({ project });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

export default router;
