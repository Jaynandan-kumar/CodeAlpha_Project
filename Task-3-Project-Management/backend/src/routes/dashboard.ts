import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// GET /api/dashboard/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    // Get user's projects
    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.userId': userId }],
      archived: { $ne: true },
    });
    const projectIds = projects.map(p => p._id);

    // Get tasks for user's projects
    const tasks = await Task.find({ project: { $in: projectIds } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const overdueTasks = tasks.filter(t =>
      t.dueDate && new Date(t.dueDate) < today && t.status !== 'completed'
    ).length;

    const upcomingDeadlines = tasks
      .filter(t => t.dueDate && new Date(t.dueDate) >= today && t.status !== 'completed')
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);

    res.json({
      stats: {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks: tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length,
        overdueTasks,
        completionPercentage: tasks.length > 0
          ? Math.round((completedTasks / tasks.length) * 100)
          : 0,
        upcomingDeadlines,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
