import { v4 as uuidv4 } from 'uuid';
import type { User, Project, Task, Activity, DashboardStats, ProjectMember, TaskStatus } from '../types';

const STORAGE_KEYS = {
  USERS: 'pf_users',
  PROJECTS: 'pf_projects',
  TASKS: 'pf_tasks',
  ACTIVITIES: 'pf_activities',
  CURRENT_USER: 'pf_current_user',
};

function getItem<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setItem<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Simple hash simulation (in real app, this would be bcrypt on server)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36) + str.length.toString(36);
}

function generateToken(userId: string): string {
  return btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }));
}

function verifyToken(token: string): string | null {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp < Date.now()) return null;
    return decoded.userId;
  } catch {
    return null;
  }
}

// ============ AUTH SERVICE ============
export const authService = {
  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    await delay();
    const users = getItem<User & { passwordHash: string }>(STORAGE_KEYS.USERS);
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw { message: 'An account with this email already exists', status: 409 };
    }

    if (password.length < 6) {
      throw { message: 'Password must be at least 6 characters', status: 400 };
    }

    const user: User & { passwordHash: string } = {
      id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    setItem(STORAGE_KEYS.USERS, users);

    const token = generateToken(user.id);
    const { passwordHash, ...safeUser } = user;
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ user: safeUser, token }));
    
    return { user: safeUser, token };
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay();
    const users = getItem<User & { passwordHash: string }>(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      throw { message: 'Invalid email or password', status: 401 };
    }

    if (user.passwordHash !== simpleHash(password)) {
      throw { message: 'Invalid email or password', status: 401 };
    }

    const token = generateToken(user.id);
    const { passwordHash, ...safeUser } = user;
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ user: safeUser, token }));
    
    return { user: safeUser, token };
  },

  async getMe(): Promise<User | null> {
    await delay(100);
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!stored) return null;
    
    try {
      const { user, token } = JSON.parse(stored);
      const userId = verifyToken(token);
      if (!userId) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return null;
      }
      return user;
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!stored) return null;
    try {
      const { user, token } = JSON.parse(stored);
      if (verifyToken(token)) return user;
      return null;
    } catch {
      return null;
    }
  }
};

// ============ PROJECT SERVICE ============
export const projectService = {
  async getAll(userId: string): Promise<Project[]> {
    await delay();
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    return projects.filter(p => 
      !p.archived && (p.owner === userId || p.members.some(m => m.userId === userId))
    ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async getById(id: string, userId: string): Promise<Project> {
    await delay();
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const project = projects.find(p => p.id === id);
    if (!project) throw { message: 'Project not found', status: 404 };
    if (project.owner !== userId && !project.members.some(m => m.userId === userId)) {
      throw { message: 'Access denied', status: 403 };
    }
    return project;
  },

  async create(data: Partial<Project>, userId: string): Promise<Project> {
    await delay();
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    
    const project: Project = {
      id: uuidv4(),
      name: data.name || 'Untitled Project',
      description: data.description || '',
      owner: userId,
      members: [{ userId, role: 'owner', joinedAt: new Date().toISOString() }],
      status: data.status || 'planning',
      priority: data.priority || 'medium',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || '',
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.push(project);
    setItem(STORAGE_KEYS.PROJECTS, projects);
    
    activityService.log({
      projectId: project.id,
      actor: userId,
      action: 'created',
      description: `created project "${project.name}"`,
      entityType: 'project',
      entityId: project.id,
    });

    return project;
  },

  async update(id: string, data: Partial<Project>, userId: string): Promise<Project> {
    await delay();
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) throw { message: 'Project not found', status: 404 };
    
    const project = projects[idx];
    if (project.owner !== userId && !project.members.some(m => m.userId === userId && (m.role === 'admin' || m.role === 'owner'))) {
      throw { message: 'Permission denied', status: 403 };
    }

    projects[idx] = { ...project, ...data, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.PROJECTS, projects);
    return projects[idx];
  },

  async delete(id: string, userId: string): Promise<void> {
    await delay();
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const project = projects.find(p => p.id === id);
    if (!project) throw { message: 'Project not found', status: 404 };
    if (project.owner !== userId) throw { message: 'Only the owner can delete projects', status: 403 };

    setItem(STORAGE_KEYS.PROJECTS, projects.filter(p => p.id !== id));
    
    // Also delete associated tasks
    const tasks = getItem<Task>(STORAGE_KEYS.TASKS);
    setItem(STORAGE_KEYS.TASKS, tasks.filter(t => t.projectId !== id));
  },

  async addMember(projectId: string, memberEmail: string, role: 'admin' | 'member', userId: string): Promise<Project> {
    await delay();
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const users = getItem<User>(STORAGE_KEYS.USERS);
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) throw { message: 'Project not found', status: 404 };

    const project = projects[idx];
    if (project.owner !== userId && !project.members.some(m => m.userId === userId && m.role === 'admin')) {
      throw { message: 'Permission denied', status: 403 };
    }

    const memberUser = users.find(u => u.email.toLowerCase() === memberEmail.toLowerCase().trim());
    if (!memberUser) throw { message: 'No user found with that email', status: 404 };
    if (project.members.some(m => m.userId === memberUser.id)) {
      throw { message: 'User is already a member', status: 409 };
    }

    const newMember: ProjectMember = {
      userId: memberUser.id,
      role,
      joinedAt: new Date().toISOString(),
    };

    projects[idx].members.push(newMember);
    projects[idx].updatedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.PROJECTS, projects);

    activityService.log({
      projectId,
      actor: userId,
      action: 'member_added',
      description: `added ${memberUser.name} as ${role}`,
      entityType: 'member',
      entityId: memberUser.id,
    });

    return projects[idx];
  },

  async removeMember(projectId: string, memberId: string, userId: string): Promise<Project> {
    await delay();
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) throw { message: 'Project not found', status: 404 };

    const project = projects[idx];
    if (project.owner !== userId) throw { message: 'Only the owner can remove members', status: 403 };
    if (memberId === project.owner) throw { message: 'Cannot remove the owner', status: 400 };

    projects[idx].members = project.members.filter(m => m.userId !== memberId);
    projects[idx].updatedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.PROJECTS, projects);
    return projects[idx];
  }
};

// ============ TASK SERVICE ============
export const taskService = {
  async getByProject(projectId: string, userId: string): Promise<Task[]> {
    await delay();
    // Verify access
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const project = projects.find(p => p.id === projectId);
    if (!project) throw { message: 'Project not found', status: 404 };
    if (project.owner !== userId && !project.members.some(m => m.userId === userId)) {
      throw { message: 'Access denied', status: 403 };
    }

    const tasks = getItem<Task>(STORAGE_KEYS.TASKS);
    return tasks.filter(t => t.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getAll(userId: string): Promise<Task[]> {
    await delay();
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const userProjectIds = projects
      .filter(p => p.owner === userId || p.members.some(m => m.userId === userId))
      .map(p => p.id);

    const tasks = getItem<Task>(STORAGE_KEYS.TASKS);
    return tasks.filter(t => userProjectIds.includes(t.projectId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(projectId: string, data: Partial<Task>, userId: string): Promise<Task> {
    await delay();
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const project = projects.find(p => p.id === projectId);
    if (!project) throw { message: 'Project not found', status: 404 };
    if (project.owner !== userId && !project.members.some(m => m.userId === userId)) {
      throw { message: 'Access denied', status: 403 };
    }

    if (data.assignee && !project.members.some(m => m.userId === data.assignee)) {
      throw { message: 'Assignee must be a project member', status: 400 };
    }

    const tasks = getItem<Task>(STORAGE_KEYS.TASKS);
    const task: Task = {
      id: uuidv4(),
      title: data.title || 'Untitled Task',
      description: data.description || '',
      projectId,
      assignee: data.assignee,
      creator: userId,
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      startDate: data.startDate || '',
      dueDate: data.dueDate || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(task);
    setItem(STORAGE_KEYS.TASKS, tasks);

    activityService.log({
      projectId,
      actor: userId,
      action: 'created',
      description: `created task "${task.title}"`,
      entityType: 'task',
      entityId: task.id,
    });

    return task;
  },

  async update(id: string, data: Partial<Task>, userId: string): Promise<Task> {
    await delay();
    const tasks = getItem<Task>(STORAGE_KEYS.TASKS);
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) throw { message: 'Task not found', status: 404 };

    const task = tasks[idx];
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const project = projects.find(p => p.id === task.projectId);
    if (!project || (project.owner !== userId && !project.members.some(m => m.userId === userId))) {
      throw { message: 'Access denied', status: 403 };
    }

    if (data.assignee && !project.members.some(m => m.userId === data.assignee)) {
      throw { message: 'Assignee must be a project member', status: 400 };
    }

    const oldStatus = task.status;
    tasks[idx] = { ...task, ...data, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.TASKS, tasks);

    if (data.status && data.status !== oldStatus) {
      activityService.log({
        projectId: task.projectId,
        actor: userId,
        action: 'status_changed',
        description: `moved task "${task.title}" from ${oldStatus} to ${data.status}`,
        entityType: 'task',
        entityId: task.id,
      });
    }

    return tasks[idx];
  },

  async updateStatus(id: string, status: TaskStatus, userId: string): Promise<Task> {
    return this.update(id, { status }, userId);
  },

  async delete(id: string, userId: string): Promise<void> {
    await delay();
    const tasks = getItem<Task>(STORAGE_KEYS.TASKS);
    const task = tasks.find(t => t.id === id);
    if (!task) throw { message: 'Task not found', status: 404 };

    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const project = projects.find(p => p.id === task.projectId);
    if (!project || (project.owner !== userId && task.creator !== userId)) {
      throw { message: 'Permission denied', status: 403 };
    }

    setItem(STORAGE_KEYS.TASKS, tasks.filter(t => t.id !== id));
  }
};

// ============ ACTIVITY SERVICE ============
export const activityService = {
  log(data: Omit<Activity, 'id' | 'timestamp'>): void {
    const activities = getItem<Activity>(STORAGE_KEYS.ACTIVITIES);
    activities.unshift({
      ...data,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    });
    // Keep only last 100 activities
    if (activities.length > 100) activities.length = 100;
    setItem(STORAGE_KEYS.ACTIVITIES, activities);
  },

  async getByUser(userId: string): Promise<Activity[]> {
    await delay(100);
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const userProjectIds = projects
      .filter(p => p.owner === userId || p.members.some(m => m.userId === userId))
      .map(p => p.id);

    const activities = getItem<Activity>(STORAGE_KEYS.ACTIVITIES);
    return activities.filter(a => userProjectIds.includes(a.projectId));
  }
};

// ============ DASHBOARD SERVICE ============
export const dashboardService = {
  async getStats(userId: string): Promise<DashboardStats> {
    await delay();
    const projects = getItem<Project>(STORAGE_KEYS.PROJECTS);
    const tasks = getItem<Task>(STORAGE_KEYS.TASKS);
    const activities = getItem<Activity>(STORAGE_KEYS.ACTIVITIES);

    const userProjects = projects.filter(p => 
      !p.archived && (p.owner === userId || p.members.some(m => m.userId === userId))
    );
    const userProjectIds = userProjects.map(p => p.id);
    const userTasks = tasks.filter(t => userProjectIds.includes(t.projectId));

    const today = new Date().toISOString().split('T')[0];
    const overdueTasks = userTasks.filter(t => 
      t.dueDate && t.dueDate < today && t.status !== 'completed'
    );

    const upcomingDeadlines = userTasks
      .filter(t => t.dueDate && t.dueDate >= today && t.status !== 'completed')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);

    const recentActivities = activities
      .filter(a => userProjectIds.includes(a.projectId))
      .slice(0, 10);

    const completedTasks = userTasks.filter(t => t.status === 'completed').length;

    return {
      totalProjects: userProjects.length,
      activeProjects: userProjects.filter(p => p.status === 'active').length,
      totalTasks: userTasks.length,
      completedTasks,
      pendingTasks: userTasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length,
      overdueTasks: overdueTasks.length,
      completionPercentage: userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0,
      recentActivities,
      upcomingDeadlines,
    };
  }
};

// ============ USER SERVICE ============
export const userService = {
  async getById(id: string): Promise<User | null> {
    const users = getItem<User>(STORAGE_KEYS.USERS);
    return users.find(u => u.id === id) || null;
  },

  async getByEmail(email: string): Promise<User | null> {
    const users = getItem<User>(STORAGE_KEYS.USERS);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getAll(): Promise<User[]> {
    const users = getItem<User>(STORAGE_KEYS.USERS);
    return users;
  },

  getMemberNames(project: Project, users: User[]): Map<string, string> {
    const map = new Map<string, string>();
    project.members.forEach(m => {
      const user = users.find(u => u.id === m.userId);
      if (user) map.set(user.id, user.name);
    });
    return map;
  }
};

// ============ SEED DATA ============
export function seedDemoData(): void {
  const users = getItem<User & { passwordHash: string }>(STORAGE_KEYS.USERS);
  if (users.length > 0) return; // Already has data

  // Create demo user
  const demoUser: User & { passwordHash: string } = {
    id: 'demo-user-1',
    name: 'Demo User',
    email: 'demo@projectflow.com',
    passwordHash: simpleHash('demo123'),
    createdAt: new Date().toISOString(),
  };

  const demoUser2: User & { passwordHash: string } = {
    id: 'demo-user-2',
    name: 'Jane Smith',
    email: 'jane@projectflow.com',
    passwordHash: simpleHash('demo123'),
    createdAt: new Date().toISOString(),
  };

  setItem(STORAGE_KEYS.USERS, [demoUser, demoUser2]);

  // Create demo projects
  const projects: Project[] = [
    {
      id: 'proj-1',
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design and improved UX.',
      owner: demoUser.id,
      members: [
        { userId: demoUser.id, role: 'owner', joinedAt: new Date().toISOString() },
        { userId: demoUser2.id, role: 'member', joinedAt: new Date().toISOString() },
      ],
      status: 'active',
      priority: 'high',
      startDate: '2025-01-15',
      dueDate: '2025-03-30',
      archived: false,
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'proj-2',
      name: 'Mobile App Development',
      description: 'Build a cross-platform mobile application for iOS and Android.',
      owner: demoUser.id,
      members: [
        { userId: demoUser.id, role: 'owner', joinedAt: new Date().toISOString() },
        { userId: demoUser2.id, role: 'admin', joinedAt: new Date().toISOString() },
      ],
      status: 'active',
      priority: 'urgent',
      startDate: '2025-02-01',
      dueDate: '2025-06-15',
      archived: false,
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'proj-3',
      name: 'API Integration',
      description: 'Integrate third-party APIs for payment processing and analytics.',
      owner: demoUser2.id,
      members: [
        { userId: demoUser2.id, role: 'owner', joinedAt: new Date().toISOString() },
        { userId: demoUser.id, role: 'member', joinedAt: new Date().toISOString() },
      ],
      status: 'planning',
      priority: 'medium',
      startDate: '2025-03-01',
      dueDate: '2025-04-30',
      archived: false,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  setItem(STORAGE_KEYS.PROJECTS, projects);

  // Create demo tasks
  const tasks: Task[] = [
    { id: 'task-1', title: 'Design homepage mockup', description: 'Create wireframes and high-fidelity mockups for the new homepage', projectId: 'proj-1', assignee: demoUser.id, creator: demoUser.id, status: 'completed', priority: 'high', startDate: '2025-01-20', dueDate: '2025-02-01', createdAt: new Date(Date.now() - 86400000 * 25).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'task-2', title: 'Implement responsive navigation', description: 'Build a responsive navigation component with mobile menu', projectId: 'proj-1', assignee: demoUser2.id, creator: demoUser.id, status: 'in-progress', priority: 'high', startDate: '2025-02-05', dueDate: '2025-02-20', createdAt: new Date(Date.now() - 86400000 * 20).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'task-3', title: 'Set up CI/CD pipeline', description: 'Configure automated testing and deployment pipeline', projectId: 'proj-1', assignee: demoUser.id, creator: demoUser.id, status: 'todo', priority: 'medium', startDate: '2025-02-15', dueDate: '2025-03-01', createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'task-4', title: 'User authentication flow', description: 'Implement login, registration, and password reset', projectId: 'proj-2', assignee: demoUser.id, creator: demoUser.id, status: 'in-review', priority: 'urgent', startDate: '2025-02-10', dueDate: '2025-02-25', createdAt: new Date(Date.now() - 86400000 * 18).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'task-5', title: 'Push notification service', description: 'Set up push notifications for iOS and Android', projectId: 'proj-2', assignee: demoUser2.id, creator: demoUser.id, status: 'todo', priority: 'medium', startDate: '2025-03-01', dueDate: '2025-03-20', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'task-6', title: 'Database schema design', description: 'Design the database schema for the mobile app', projectId: 'proj-2', assignee: demoUser.id, creator: demoUser.id, status: 'completed', priority: 'high', startDate: '2025-02-01', dueDate: '2025-02-10', createdAt: new Date(Date.now() - 86400000 * 22).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'task-7', title: 'Research payment APIs', description: 'Evaluate Stripe, PayPal, and other payment providers', projectId: 'proj-3', assignee: demoUser.id, creator: demoUser2.id, status: 'in-progress', priority: 'medium', startDate: '2025-03-05', dueDate: '2025-03-15', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'task-8', title: 'Write API documentation', description: 'Document all REST endpoints with examples', projectId: 'proj-3', assignee: demoUser2.id, creator: demoUser2.id, status: 'todo', priority: 'low', startDate: '2025-03-15', dueDate: '2025-04-01', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), updatedAt: new Date().toISOString() },
  ];
  setItem(STORAGE_KEYS.TASKS, tasks);

  // Create demo activities
  const activities: Activity[] = [
    { id: 'act-1', projectId: 'proj-1', actor: demoUser.id, action: 'created', description: 'created project "Website Redesign"', entityType: 'project', entityId: 'proj-1', timestamp: new Date(Date.now() - 86400000 * 30).toISOString() },
    { id: 'act-2', projectId: 'proj-2', actor: demoUser.id, action: 'created', description: 'created project "Mobile App Development"', entityType: 'project', entityId: 'proj-2', timestamp: new Date(Date.now() - 86400000 * 20).toISOString() },
    { id: 'act-3', projectId: 'proj-1', actor: demoUser.id, action: 'created', description: 'created task "Design homepage mockup"', entityType: 'task', entityId: 'task-1', timestamp: new Date(Date.now() - 86400000 * 25).toISOString() },
    { id: 'act-4', projectId: 'proj-2', actor: demoUser.id, action: 'status_changed', description: 'moved task "User authentication flow" to in-review', entityType: 'task', entityId: 'task-4', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'act-5', projectId: 'proj-1', actor: demoUser2.id, action: 'status_changed', description: 'moved task "Implement responsive navigation" to in-progress', entityType: 'task', entityId: 'task-2', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
  ];
  setItem(STORAGE_KEYS.ACTIVITIES, activities);
}
