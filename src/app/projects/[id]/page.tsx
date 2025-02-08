import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectTabs from "@/components/projects/ProjectTabs";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen p-8">
      <Link 
        href="/projects"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Link>
      
      <ProjectHeader projectId={params.id} />
      <ProjectTabs projectId={params.id} />
    </div>
  );
} 