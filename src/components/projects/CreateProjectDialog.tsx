"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ArrowRight, ArrowLeft, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { format, addDays, addWeeks } from "date-fns";

type FormStep = 'details' | 'timeline' | 'financial' | 'documents' | 'review';

const STEPS: { [key in FormStep]: { title: string; description: string } } = {
  details: {
    title: "Project Details",
    description: "Fill in the basic project information"
  },
  timeline: {
    title: "Timeline",
    description: "Set project timeline and milestones"
  },
  financial: {
    title: "Financial Details",
    description: "Enter budget and financial information"
  },
  documents: {
    title: "Documents",
    description: "Upload relevant project documents"
  },
  review: {
    title: "Review",
    description: "Review all project information"
  }
};

type DurationType = 'days' | 'weeks';

const initialFormData = {
  name: '',
  customerName: '',
  companyName: '',
  address: '',
  contactPhones: [''],
  contactEmails: [''],
  description: '',
  startDate: format(new Date(), 'yyyy-MM-dd'),
  duration: '',
  durationType: 'days' as DurationType,
  estimatedEndDate: '',
  budget: '0',
  estimatedCost: '0',
  documents: [] as File[]
};

export function CreateProjectDialog({ onProjectCreated }: { onProjectCreated?: (project: Project) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('details');
  const [formData, setFormData] = useState(initialFormData);
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (name: 'contactPhones' | 'contactEmails', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].map((item: string, i: number) => i === index ? value : item)
    }));
  };

  const addArrayItem = (name: 'contactPhones' | 'contactEmails') => {
    setFormData(prev => ({
      ...prev,
      [name]: [...prev[name], '']
    }));
  };

  const removeArrayItem = (name: 'contactPhones' | 'contactEmails', index: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleNext = () => {
    const steps: FormStep[] = ['details', 'timeline', 'financial', 'documents', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: FormStep[] = ['details', 'timeline', 'financial', 'documents', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep('details');
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep !== 'review') {
      handleNext();
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget) || 0,
          estimatedCost: parseFloat(formData.estimatedCost) || 0,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to create project");

      const newProject = await response.json();
      
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      
      if (onProjectCreated) {
        onProjectCreated(newProject);
      }
      
      handleDialogChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEndDate = (startDate: string, duration: string, type: DurationType) => {
    if (!startDate || !duration || isNaN(Number(duration))) return '';
    
    const start = new Date(startDate);
    const durationNumber = parseInt(duration);
    
    if (type === 'weeks') {
      return format(addWeeks(start, durationNumber), 'yyyy-MM-dd');
    } else {
      return format(addDays(start, durationNumber), 'yyyy-MM-dd');
    }
  };

  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const endDate = calculateEndDate(formData.startDate, formData.duration, formData.durationType);
      setFormData(prev => ({ ...prev, estimatedEndDate: endDate }));
    }
  }, [formData.startDate, formData.duration, formData.durationType]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'details':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
                placeholder="Enter project name" 
              />
            </div>
            <div>
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input 
                id="customerName" 
                name="customerName" 
                value={formData.customerName}
                onChange={handleInputChange}
                required 
                placeholder="Enter customer name" 
              />
            </div>
            <div>
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input 
                id="companyName" 
                name="companyName" 
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter company name" 
              />
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address}
                onChange={handleInputChange}
                required 
                placeholder="Enter address" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Contact Phone *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('contactPhones')}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.contactPhones.map((phone, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input 
                    value={phone}
                    onChange={(e) => handleArrayInputChange('contactPhones', index, e.target.value)}
                    required 
                    type="tel"
                    placeholder="Enter contact phone"
                  />
                  {formData.contactPhones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem('contactPhones', index)}
                      className="h-10 w-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Contact Email *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('contactEmails')}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.contactEmails.map((email, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input 
                    value={email}
                    onChange={(e) => handleArrayInputChange('contactEmails', index, e.target.value)}
                    required 
                    type="email"
                    placeholder="Enter contact email"
                  />
                  {formData.contactEmails.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem('contactEmails', index)}
                      className="h-10 w-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter project description"
                className="h-24"
              />
            </div>
          </div>
        );
      case 'timeline':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input 
                id="startDate" 
                name="startDate" 
                value={formData.startDate}
                onChange={handleInputChange}
                required 
                type="date" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  type="number"
                  min="1"
                  placeholder="Enter duration"
                />
              </div>
              <div>
                <Label htmlFor="durationType">Duration Type *</Label>
                <select
                  id="durationType"
                  name="durationType"
                  value={formData.durationType}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
              <Input 
                id="estimatedEndDate" 
                name="estimatedEndDate" 
                value={formData.estimatedEndDate}
                readOnly
                type="date"
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">
                Auto-calculated based on start date and duration
              </p>
            </div>
          </div>
        );
      case 'financial':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget *</Label>
                <Input
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter project budget"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Total available budget
                </p>
              </div>
              <div>
                <Label htmlFor="estimatedCost">Estimated Cost *</Label>
                <Input
                  id="estimatedCost"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleInputChange}
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter estimated cost"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Expected total cost
                </p>
              </div>
            </div>
            {parseFloat(formData.estimatedCost) > parseFloat(formData.budget) && (
              <div className="text-yellow-600 text-sm flex items-center mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Estimated cost exceeds budget
              </div>
            )}
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="documents">Project Documents</Label>
              <Input
                id="documents"
                name="documents"
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setFormData(prev => ({ ...prev, documents: files }));
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Project Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Project Name</p>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Customer Name</p>
                <p className="font-medium">{formData.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Company Name</p>
                <p className="font-medium">{formData.companyName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Address</p>
                <p className="font-medium">{formData.address}</p>
              </div>
              <div>
                <p className="text-gray-600">Contact Phones</p>
                <div>
                  {formData.contactPhones.map((phone, index) => (
                    <p key={index} className="font-medium">{phone}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-600">Contact Emails</p>
                <div>
                  {formData.contactEmails.map((email, index) => (
                    <p key={index} className="font-medium">{email}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-600">Description</p>
                <p className="font-medium">{formData.description || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Start Date</p>
                <p className="font-medium">{formData.startDate}</p>
              </div>
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-medium">{formData.duration} {formData.durationType}</p>
              </div>
              <div>
                <p className="text-gray-600">End Date</p>
                <p className="font-medium">{formData.estimatedEndDate}</p>
              </div>
              <div>
                <p className="text-gray-600">Budget</p>
                <p className="font-medium">${parseFloat(formData.budget).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Estimated Cost</p>
                <p className={`font-medium ${parseFloat(formData.estimatedCost) > parseFloat(formData.budget) ? 'text-yellow-600' : ''}`}>
                  ${parseFloat(formData.estimatedCost).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Margin</p>
                <p className={`font-medium ${parseFloat(formData.budget) - parseFloat(formData.estimatedCost) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${(parseFloat(formData.budget) - parseFloat(formData.estimatedCost)).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Documents</p>
                <p className="font-medium">{formData.documents.length} files selected</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors">
          <Plus className="h-5 w-5" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{STEPS[currentStep].title}</DialogTitle>
          <p className="text-sm text-gray-500">{STEPS[currentStep].description}</p>
        </DialogHeader>

        <div className="relative mt-4">
          <div className="absolute top-0 left-0 w-full">
            <div className="flex justify-between">
              {Object.keys(STEPS).map((step, index) => (
                <div 
                  key={step}
                  className={`flex-1 h-2 ${
                    index === 0 ? 'rounded-l-full' : ''
                  } ${
                    index === Object.keys(STEPS).length - 1 ? 'rounded-r-full' : ''
                  } ${
                    Object.keys(STEPS).indexOf(currentStep) >= index 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between gap-4">
            {currentStep !== 'details' && (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex-1" />
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : currentStep === 'review' ? 'Create Project' : 'Next'}
              {currentStep !== 'review' && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 