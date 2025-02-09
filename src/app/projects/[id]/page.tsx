'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getProject } from '@/lib/firebase/firebaseUtils';
import { Project } from '@/types/project';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar, BarChart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DocumentList } from '@/components/projects/DocumentList';

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  type: string;
  category: string;
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Construction Contract.pdf",
    uploadDate: "2024-01-15",
    size: "2.4 MB",
    type: "Contract",
    category: "Owner Documents"
  },
  {
    id: "2",
    name: "Foundation Plans.pdf",
    uploadDate: "2024-01-25",
    size: "5.6 MB",
    type: "Engineering Plans",
    category: "Construction Documents"
  }
];

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [isLoading, setIsLoading] = useState(true);
  const [documents] = useState<Document[]>(MOCK_DOCUMENTS);

  useEffect(() => {
    async function fetchProject() {
      if (!user) return;
      try {
        const projectData = await getProject(params.id);
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [params.id, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const progress = Math.round((project.completedTasks || 0) / (project.totalTasks || 1) * 100);

  const handleViewDocument = (doc: Document) => {
    // Implement view document functionality
    console.log('View document:', doc);
  };

  const handleDownloadDocument = (doc: Document) => {
    // Implement download document functionality
    console.log('Download document:', doc);
  };

  const handleDeleteDocument = (doc: Document) => {
    // Implement delete document functionality
    console.log('Delete document:', doc);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/projects" className="text-blue-600 hover:text-blue-700">
          ← Back to Projects
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{project.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-600">Total Budget</div>
              <div className="text-2xl font-bold">${project.budget?.toLocaleString()}</div>
              <div className="text-blue-600 mt-1">
                Spent: ${project.spent?.toLocaleString() || 0}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Start</div>
                <div>{new Date(project.startDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">End</div>
                <div>{new Date(project.estimatedEndDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Completion</div>
                <div>{progress}%</div>
              </div>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {project.status}
              </span>
            </div>
          </div>

          <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="border-t">
          <div className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab('financials')}
              className={`py-4 px-2 -mb-px font-medium text-sm border-b-2 ${
                activeTab === 'financials'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Financials
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-2 -mb-px font-medium text-sm border-b-2 ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-2 -mb-px font-medium text-sm border-b-2 ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`py-4 px-2 -mb-px font-medium text-sm border-b-2 ${
                activeTab === 'team'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Team
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Project Documents</h2>
              <Button>
                Upload Document
              </Button>
            </div>
            <DocumentList
              documents={documents}
              onView={handleViewDocument}
              onDownload={handleDownloadDocument}
              onDelete={handleDeleteDocument}
            />
          </div>
        )}
        {/* Other tab contents will go here */}
      </div>
    </div>
  );
} 