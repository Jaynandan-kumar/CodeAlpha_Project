import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService, userService } from '../services/api';
import type { Project, User } from '../types';
import { Loader2, Users, Shield, User as UserIcon } from 'lucide-react';

export default function Team() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const [projectsData, usersData] = await Promise.all([
          projectService.getAll(user.id),
          userService.getAll(),
        ]);
        setProjects(projectsData);
        setAllUsers(usersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const getUserName = (id: string) => allUsers.find(u => u.id === id)?.name || 'Unknown';
  const getUserEmail = (id: string) => allUsers.find(u => u.id === id)?.email || '';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Get all unique members across user's projects
  const allMembers = new Map<string, { user: User; projects: string[]; roles: string[] }>();
  projects.forEach(project => {
    project.members.forEach(member => {
      const memberUser = allUsers.find(u => u.id === member.userId);
      if (memberUser) {
        const existing = allMembers.get(member.userId);
        if (existing) {
          existing.projects.push(project.name);
          existing.roles.push(member.role);
        } else {
          allMembers.set(member.userId, {
            user: memberUser,
            projects: [project.name],
            roles: [member.role],
          });
        }
      }
    });
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <p className="text-gray-600 mt-1">View members across your projects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{allMembers.size}</p>
              <p className="text-sm text-gray-500">Total Members</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              <p className="text-sm text-gray-500">Your Projects</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.owner === user?.id).length}
              </p>
              <p className="text-sm text-gray-500">Owned Projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Members list */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Members</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from(allMembers.values()).map(({ user: memberUser, projects: memberProjects, roles }) => (
            <div key={memberUser.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-700">
                    {memberUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">{memberUser.name}</h3>
                    {memberUser.id === user?.id && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-indigo-100 text-indigo-700 rounded">You</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{memberUser.email}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {memberProjects.map((proj, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">
                        {proj}
                        <span className="text-gray-400">({roles[idx]})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects with members */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-medium text-gray-900 mb-3">{project.name}</h3>
              <div className="space-y-2">
                {project.members.map(member => {
                  const memberUser = allUsers.find(u => u.id === member.userId);
                  return (
                    <div key={member.userId} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-[9px] font-medium text-indigo-700">
                          {memberUser?.name.charAt(0) || '?'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 flex-1">{memberUser?.name || 'Unknown'}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        member.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                        member.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
