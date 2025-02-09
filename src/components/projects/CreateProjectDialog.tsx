"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Project } from "@/types/project";

interface CreateProjectDialogProps {
  onProjectCreated: (project: Omit<Project, 'id'>) => Promise<void>;
}

export function CreateProjectDialog({ onProjectCreated }: CreateProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const newProject: Omit<Project, 'id'> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      customerName: formData.get('customerName') as string,
      address: formData.get('address') as string,
      contactPhones: [(formData.get('phone') as string)],
      contactEmails: [(formData.get('email') as string)],
      location: formData.get('location') as string,
      status: "Planning",
      budget: Number(formData.get('budget')),
      estimatedCost: Number(formData.get('estimatedCost')),
      spent: 0,
      startDate: formData.get('startDate') as string,
      duration: formData.get('duration') as string,
      durationType: "weeks",
      estimatedEndDate: formData.get('endDate') as string,
      documents: [],
    };

    try {
      await onProjectCreated(newProject);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg">New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input id="customerName" name="customerName" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input 
                id="budget" 
                name="budget" 
                type="number" 
                min="0"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost</Label>
              <Input 
                id="estimatedCost" 
                name="estimatedCost" 
                type="number"
                min="0" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate" 
                name="startDate" 
                type="date" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Estimated End Date</Label>
              <Input 
                id="endDate" 
                name="endDate" 
                type="date" 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 