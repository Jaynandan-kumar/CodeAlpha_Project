import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService, userService } from '../services/api';
import type { DashboardStats, User } from '../types';
import {
  FolderKanban, ListTodo, CheckCircle2, Clock, AlertTriangle,
  TrendingUp, ArrowRight, Loader2
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const [statsData, usersData] = await Promise.all([
          dashboardService.getStats(user.id),
          userService.getAll(),
        ]);
        setStats(statsData);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderKanban, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Projects', value: stats.activeProjects, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Total Tasks', value: stats.totalTasks, icon: ListTodo, color: 'bg-purple-50 text-purple-600' },
    { label: 'Completed', value: stats.completedTasks, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Overdue', value: stats.overdueTasks, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's your project overview.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color} mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Completion progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Task Completion</h2>
          <span className="text-2xl font-bold text-indigo-600">{stats.completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {stats.completedTasks} of {stats.totalTasks} tasks completed
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-4">
            {stats.recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No recent activity</p>
                <Link to="/projects" className="text-indigo-600 text-sm font-medium mt-2 inline-block hover:text-indigo-700">
                  Create your first project →
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {stats.recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-indigo-700">
                        {getUserName(activity.actor).charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">{getUserName(activity.actor)}</span>{' '}
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(activity.timestamp).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
          </div>
          <div className="p-4">
            {stats.upcomingDeadlines.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No upcoming deadlines</p>
                <Link to="/tasks" className="text-indigo-600 text-sm font-medium mt-2 inline-block hover:text-indigo-700">
                  View all tasks →
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {stats.upcomingDeadlines.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className={`
                      px-2 py-0.5 text-xs font-medium rounded-full
                      ${task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'}
                    `}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <p className="text-indigo-100 text-sm mb-4">Get started with common tasks</p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            <FolderKanban className="w-4 h-4" />
            View Projects
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            <ListTodo className="w-4 h-4" />
            Manage Tasks
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            to="/kanban"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Kanban Board
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
