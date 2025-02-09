'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  CalendarClock,
  MoreVertical
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Overdue';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review Foundation Plans',
    project: 'Downtown Office Complex',
    dueDate: '2024-02-15',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'John Doe'
  },
  {
    id: '2',
    title: 'Submit Building Permits',
    project: 'Downtown Office Complex',
    dueDate: '2024-02-20',
    status: 'Pending',
    priority: 'High',
    assignedTo: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Finalize Material Orders',
    project: 'Downtown Office Complex',
    dueDate: '2024-02-10',
    status: 'Overdue',
    priority: 'Medium',
    assignedTo: 'Mike Johnson'
  }
];

export default function TasksPage() {
  const [tasks] = useState<Task[]>(MOCK_TASKS);
  const [filter, setFilter] = useState<Task['status'] | 'All'>('All');

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Pending':
        return <CalendarClock className="h-5 w-5 text-yellow-500" />;
      case 'Overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
    }
  };

  const filteredTasks = filter === 'All' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button>
          Create Task
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        {['All', 'In Progress', 'Pending', 'Completed', 'Overdue'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as Task['status'] | 'All')}
            className={`text-sm font-medium ${
              filter === status
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {getStatusIcon(task.status)}
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.project}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      Assigned to {task.assignedTo}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 