"use client";

import { Building2, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getUserProjects, createProject } from "@/lib/firebase/firebaseUtils";
import { useToast } from "@/components/ui/use-toast";

// Initial example projects
const EXAMPLE_PROJECTS: Project[] = [
  {
    id: "example-1",
    name: "Downtown Office Complex",
    description: "A modern office complex in downtown area",
    customerName: "John Smith",
    address: "123 Main St, City, State 12345",
    contactPhones: ["555-0123"],
    contactEmails: ["john@example.com"],
    location: "123 Main St, Downtown",
    status: "In Progress",
    budget: 2500000,
    estimatedCost: 2000000,
    spent: 1200000,
    startDate: "2024-01-15",
    duration: "50",
    durationType: "weeks",
    estimatedEndDate: "2024-12-31",
    documents: [],
  },
  {
    id: "example-2",
    name: "Residential Tower",
    description: "Luxury residential tower with 200 units",
    customerName: "Sarah Johnson",
    address: "456 Park Ave, Uptown",
    contactPhones: ["555-0124"],
    contactEmails: ["sarah@example.com"],
    location: "456 Park Ave, Uptown",
    status: "Planning",
    budget: 5000000,
    estimatedCost: 4500000,
    spent: 250000,
    startDate: "2024-03-01",
    duration: "65",
    durationType: "weeks",
    estimatedEndDate: "2025-06-30",
    documents: [],
  },
];

// Load projects from localStorage
function getStoredProjects(): Project[] {
  if (typeof window === 'undefined') return EXAMPLE_PROJECTS;
  const stored = localStorage.getItem('user-projects');
  // Get user projects
  const userProjects = stored ? JSON.parse(stored) : [];
  // Always combine with example projects
  return [...EXAMPLE_PROJECTS, ...userProjects];
}

// Save only user projects to localStorage
function saveProjects(projects: Project[]) {
  if (typeof window !== 'undefined') {
    // Filter out example projects before saving
    const userProjects = projects.filter(p => !p.id.startsWith('example-'));
    localStorage.setItem('user-projects', JSON.stringify(userProjects));
  }
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProjects() {
      if (!user) {
        setProjects([]);
        setIsLoading(false);
        return;
      }

      try {
        const userProjects = await getUserProjects(user.uid);
        setProjects(userProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [user, toast]);

  const handleProjectCreated = async (newProject: Omit<Project, 'id'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to create projects",
        variant: "destructive",
      });
      return;
    }

    try {
      const createdProject = await createProject(user.uid, newProject);
      setProjects(prev => [...prev, createdProject]);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-600">Manage your construction projects</p>
        </div>
        <CreateProjectDialog onProjectCreated={handleProjectCreated} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <Link 
            key={project.id}
            href={`/projects/${project.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-500 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {project.status || "In Progress"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Budget</p>
                <p className="text-lg font-semibold">${project.budget?.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="h-5 w-5" />
                <span>Cost: ${project.estimatedCost?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Start: {project.startDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>End: {project.estimatedEndDate}</span>
              </div>
            </div>
          </Link>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No projects yet. Click "New Project" to create one.
          </div>
        )}
      </div>
    </div>
  );
} 