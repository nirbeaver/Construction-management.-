import { NextResponse } from "next/server";
import { Project } from "@/types/project";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const project: Project = {
      ...body,
      budget: parseFloat(body.budget) || 0,
      estimatedCost: parseFloat(body.estimatedCost) || 0,
      status: "In Progress",
      spent: 0,
      documents: [],
    };
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json([]);
} 