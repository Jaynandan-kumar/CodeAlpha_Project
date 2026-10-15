import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService, projectService, userService } from '../services/api';
import type { Task, Project, User, TaskStatus } from '../types';
import {
  DndContext, DragEndEvent, DragStartEvent, DragOverlay,
  useDraggable, useDroppable
} from '@dnd-kit/core';
import { Loader2, Plus, Calendar, AlertTriangle } from 'lucide-react';

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'Todo', color: 'border-gray-300 bg-gray-50' },
  { id: 'in-progress', title: 'In Progress', color: 'border-blue-300 bg-blue-50' },
  { id: 'in-review', title: 'In Review', color: 'border-yellow-300 bg-yellow-50' },
  { id: 'completed', title: 'Completed', color: 'border-green-300 bg-green-50' },
];

const priorityDots: Record<string, string> = {
  low: 'bg-gray-400',
  medium: 'bg-blue-400',
  high: 'bg-orange-400',
  urgent: 'bg-red-400',
};

function KanbanCard({ task, users, projects, isDragging }: {
  task: Task;
  users: User[];
  projects: Project[];
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
    data: { task },
  });

  const assignee = users.find(u => u.id === task.assignee);
  const project = projects.find(p => p.id === task.projectId);
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = task.dueDate && task.dueDate < today && task.status !== 'completed';

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-gray-900 leading-tight">{task.title}</h4>
        <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${priorityDots[task.priority]}`} />
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {assignee && (
            <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center" title={assignee.name}>
              <span className="text-[9px] font-medium text-indigo-700">{assignee.name.charAt(0)}</span>
            </div>
          )}
          {project && (
            <span className="text-[10px] text-gray-400 truncate max-w-[80px]">{project.name}</span>
          )}
        </div>
        {task.dueDate && (
          <span className={`flex items-center gap-0.5 text-[10px] ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
            {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({ column, tasks, users, projects }: {
  column: typeof columns[0];
  tasks: Task[];
  users: User[];
  projects: Project[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex-1 min-w-[280px]">
      <div className={`rounded-xl border-t-2 ${column.color} p-3 h-full`}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold text-gray-700">{column.title}</h3>
          <span className="text-xs font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
            {tasks.length}
          </span>
        </div>
        <div ref={setNodeRef} className={`space-y-2 min-h-[200px] rounded-lg p-1 transition-colors ${isOver ? 'bg-indigo-50/50' : ''}`}>
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} users={users} projects={projects} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-xs text-gray-400">
              Drop tasks here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Kanban() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const loadData = async () => {
    if (!user) return;
    try {
      const [tasksData, projectsData, usersData] = await Promise.all([
        taskService.getAll(user.id),
        projectService.getAll(user.id),
        userService.getAll(),
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setAllUsers(usersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const filteredTasks = projectFilter === 'all'
    ? tasks
    : tasks.filter(t => t.projectId === projectFilter);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || !user) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find(t => t.id === taskId);

    if (task && task.status !== newStatus) {
      try {
        await taskService.updateStatus(taskId, newStatus, user.id);
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      } catch (err: any) {
        alert(err.message || 'Failed to update task status');
      }
    }
  };

  const activeTask = tasks.find(t => t.id === activeId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600 mt-1">Drag tasks between columns to update status</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* Kanban board */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={filteredTasks.filter(t => t.status === column.id)}
              users={allUsers}
              projects={projects}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <KanbanCard task={activeTask} users={allUsers} projects={projects} isDragging />
          )}
        </DragOverlay>
      </DndContext>

      {/* Keyboard alternative */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Status Update</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredTasks.slice(0, 10).map(task => (
            <div key={task.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <span className="text-sm text-gray-900 truncate flex-1">{task.title}</span>
              <select
                value={task.status}
                onChange={async (e) => {
                  if (!user) return;
                  const newStatus = e.target.value as TaskStatus;
                  try {
                    await taskService.updateStatus(task.id, newStatus, user.id);
                    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
                  } catch (err: any) {
                    alert(err.message);
                  }
                }}
                className="ml-3 px-2 py-1 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
