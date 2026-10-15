import { Router, Request, Response } from 'express';
import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { authMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
router.use(authMiddleware);

// GET /api/tasks - Get all tasks for user's projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;
    const priority = req.query.priority as string;

    // Get user's project IDs
    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.userId': userId }],
    }).select('_id');
    const projectIds = projects.map(p => p._id);

    const query: any = { project: { $in: projectIds } };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .populate('creator', 'name email');

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /api/projects/:projectId/tasks
router.get('/project/:projectId', async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const project = await Project.findById(req.params.projectId);
    if (!project) throw new AppError('Project not found', 404);

    const isMember = project.owner.toString() === userId.toString() ||
      project.members.some(m => m.userId.toString() === userId.toString());
    if (!isMember) throw new AppError('Access denied', 403);

    const tasks = await Task.find({ project: project._id })
      .sort({ createdAt: -1 })
      .populate('assignee', 'name email')
      .populate('creator', 'name email');

    res.json({ tasks });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/projects/:projectId/tasks
router.post('/project/:projectId', async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const project = await Project.findById(req.params.projectId);
    if (!project) throw new AppError('Project not found', 404);

    const isMember = project.owner.toString() === userId.toString() ||
      project.members.some(m => m.userId.toString() === userId.toString());
    if (!isMember) throw new AppError('Access denied', 403);

    const { title, description, assignee, priority, status, startDate, dueDate } = req.body;

    if (!title || title.trim().length < 2) {
      throw new AppError('Task title is required (min 2 characters)', 400);
    }

    // Validate assignee is a project member
    if (assignee) {
      const isProjectMember = project.members.some(m => m.userId.toString() === assignee);
      if (!isProjectMember && project.owner.toString() !== assignee) {
        throw new AppError('Assignee must be a project member', 400);
      }
    }

    const task = new Task({
      title: title.trim(),
      description: description || '',
      project: project._id,
      assignee: assignee || undefined,
      creator: userId,
      status: status || 'todo',
      priority: priority || 'medium',
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
    });

    await task.save();
    await task.populate('assignee', 'name email');
    await task.populate('creator', 'name email');

    res.status(201).json({ task });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) throw new AppError('Task not found', 404);

    const userId = req.user!._id;
    const project = await Project.findById(task.project._id || task.project);
    if (!project) throw new AppError('Project not found', 404);

    const isMember = project.owner.toString() === userId.toString() ||
      project.members.some(m => m.userId.toString() === userId.toString());
    if (!isMember) throw new AppError('Access denied', 403);

    const allowedUpdates = ['title', 'description', 'assignee', 'status', 'priority', 'startDate', 'dueDate'];
    allowedUpdates.forEach(key => {
      if (req.body[key] !== undefined) {
        (task as any)[key] = req.body[key];
      }
    });

    await task.save();
    await task.populate('assignee', 'name email');

    res.json({ task });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) throw new AppError('Task not found', 404);

    const userId = req.user!._id;
    if (task.creator.toString() !== userId.toString()) {
      const project = await Project.findById(task.project);
      if (!project || project.owner.toString() !== userId.toString()) {
        throw new AppError('Permission denied', 403);
      }
    }

    await Task.findByIdAndDelete(task._id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
