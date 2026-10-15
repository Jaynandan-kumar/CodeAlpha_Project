import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectService, taskService, userService } from '../services/api';
import type { Project, Task, User, TaskPriority, TaskStatus } from '../types';
import {
  ArrowLeft, Loader2, Plus, X, AlertCircle, Calendar, Users,
  Trash2, Edit2, CheckCircle2, Clock, Circle
} from 'lucide-react';

const statusColors: Record<TaskStatus, string> = {
  'todo': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'in-review': 'bg-yellow-100 text-yellow-700',
  'completed': 'bg-green-100 text-green-700',
};

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
};

const statusIcons: Record<TaskStatus, typeof Circle> = {
  'todo': Circle,
  'in-progress': Clock,
  'in-review': Edit2,
  'completed': CheckCircle2,
};

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('todo');
  const [taskDue, setTaskDue] = useState('');

  // Member form
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<'admin' | 'member'>('member');

  const loadData = async () => {
    if (!user || !id) return;
    try {
      const [projectData, tasksData, usersData] = await Promise.all([
        projectService.getById(id, user.id),
        taskService.getByProject(id, user.id),
        userService.getAll(),
      ]);
      setProject(projectData);
      setTasks(tasksData);
      setAllUsers(usersData);
    } catch (err: any) {
      if (err.status === 404 || err.status === 403) {
        navigate('/projects');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user, id]);

  const getUserName = (userId: string) => allUsers.find(u => u.id === userId)?.name || 'Unknown';
  const getUserInitial = (userId: string) => (allUsers.find(u => u.id === userId)?.name || 'U').charAt(0);

  const openCreateTask = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskAssignee('');
    setTaskPriority('medium');
    setTaskStatus('todo');
    setTaskDue('');
    setError('');
    setShowTaskModal(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setTaskAssignee(task.assignee || '');
    setTaskPriority(task.priority);
    setTaskStatus(task.status);
    setTaskDue(task.dueDate);
    setError('');
    setShowTaskModal(true);
  };

  const handleTaskSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    if (!taskTitle.trim()) {
      setError('Task title is required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, {
          title: taskTitle.trim(),
          description: taskDesc.trim(),
          assignee: taskAssignee || undefined,
          priority: taskPriority,
          status: taskStatus,
          dueDate: taskDue,
        }, user.id);
      } else {
        await taskService.create(id, {
          title: taskTitle.trim(),
          description: taskDesc.trim(),
          assignee: taskAssignee || undefined,
          priority: taskPriority,
          status: taskStatus,
          dueDate: taskDue,
        }, user.id);
      }
      setShowTaskModal(false);
      const tasksData = await taskService.getByProject(id, user.id);
      setTasks(tasksData);
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    if (!confirm('Delete this task?')) return;
    try {
      await taskService.delete(taskId, user.id);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete task');
    }
  };

  const handleAddMember = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    if (!memberEmail.trim()) {
      setError('Email is required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const updated = await projectService.addMember(id, memberEmail, memberRole, user.id);
      setProject(updated);
      setShowMemberModal(false);
      setMemberEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!user || !id) return;
    if (!confirm('Remove this member?')) return;
    try {
      const updated = await projectService.removeMember(id, memberId, user.id);
      setProject(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to remove member');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    if (!user) return;
    try {
      await taskService.updateStatus(taskId, newStatus, user.id);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!project) return null;

  const isOwner = project.owner === user?.id;
  const taskCounts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    'in-review': tasks.filter(t => t.status === 'in-review').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Project header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description || 'No description'}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                project.status === 'active' ? 'bg-green-100 text-green-700' :
                project.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                project.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {project.status}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                project.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                project.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                project.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {project.priority} priority
              </span>
              {project.dueDate && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Due {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowMemberModal(true)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Users className="w-4 h-4" />
            Manage Members
          </button>
        </div>

        {/* Task progress */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">Progress:</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{ width: `${tasks.length > 0 ? (taskCounts.completed / tasks.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-gray-700 font-medium">
              {taskCounts.completed}/{tasks.length} tasks
            </span>
          </div>
        </div>
      </div>

      {/* Tasks section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
          <button
            onClick={openCreateTask}
            className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 mb-3">No tasks yet</p>
            <button
              onClick={openCreateTask}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Create First Task
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {tasks.map(task => {
              const StatusIcon = statusIcons[task.status];
              const today = new Date().toISOString().split('T')[0];
              const isOverdue = task.dueDate && task.dueDate < today && task.status !== 'completed';
              return (
                <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleStatusChange(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                      className={`mt-0.5 ${task.status === 'completed' ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'}`}
                    >
                      <StatusIcon className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                        {isOverdue && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-red-100 text-red-700">
                            Overdue
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        {task.assignee && (
                          <span className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-[8px] font-medium text-indigo-700">{getUserInitial(task.assignee)}</span>
                            </div>
                            {getUserName(task.assignee)}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className={isOverdue ? 'text-red-500' : ''}>
                            Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                        <select
                          value={task.status}
                          onChange={e => handleStatusChange(task.id, e.target.value as TaskStatus)}
                          className={`text-xs border-0 bg-transparent p-0 focus:ring-0 cursor-pointer ${
                            task.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                          }`}
                        >
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="in-review">In Review</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditTask(task)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">{editingTask ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={() => setShowTaskModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleTaskSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                  placeholder="Task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <select
                    value={taskAssignee}
                    onChange={e => setTaskAssignee(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="">Unassigned</option>
                    {project.members.map(m => (
                      <option key={m.userId} value={m.userId}>{getUserName(m.userId)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={taskStatus}
                    onChange={e => setTaskStatus(e.target.value as TaskStatus)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="in-review">In Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDue}
                    onChange={e => setTaskDue(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Team Members</h2>
              <button onClick={() => setShowMemberModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Current members */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Current Members</h3>
                {project.members.map(member => (
                  <div key={member.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-700">{getUserInitial(member.userId)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{getUserName(member.userId)}</p>
                        <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                      </div>
                    </div>
                    {isOwner && member.userId !== project.owner && (
                      <button
                        onClick={() => handleRemoveMember(member.userId)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add member form */}
              {isOwner && (
                <form onSubmit={handleAddMember} className="pt-4 border-t border-gray-100 space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Add Member</h3>
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={e => setMemberEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <select
                    value={memberRole}
                    onChange={e => setMemberRole(e.target.value as 'admin' | 'member')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Add Member
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
