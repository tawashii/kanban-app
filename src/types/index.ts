export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: Tag[];
  checklist: ChecklistItem[];
  archived: boolean;
}

export interface Column {
  id: string;
  title: string;
  status: string;
  tasks: Task[];
  color?: string;
  position: number;
}