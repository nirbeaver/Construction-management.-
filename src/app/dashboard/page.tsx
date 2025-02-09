'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getUserProjects } from '@/lib/firebase/firebaseUtils';
import { Project } from '@/types/project';
import { Card } from '@/components/ui/card';
import { Building2, Clock, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const projectsData = await getUserProjects(user.uid);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const delayedProjects = projects.filter(p => 
    new Date(p.estimatedEndDate) < new Date() && p.status !== 'Completed'
  ).length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold">{activeProjects}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Projects</p>
              <p className="text-2xl font-bold">{completedProjects}</p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delayed Projects</p>
              <p className="text-2xl font-bold">{delayedProjects}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
          <div className="space-y-4">
            {projects
              .filter(p => p.status === 'In Progress')
              .slice(0, 5)
              .map(project => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.id}`}
                  className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-600">Due: {new Date(project.estimatedEndDate).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      ${project.budget?.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
          <div className="space-y-4">
            {projects
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 5)
              .map(project => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-600">
                        Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 