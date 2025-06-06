import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column as ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';
import { ColumnHeader } from './ColumnHeader';

interface ColumnProps {
  column: ColumnType;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onEditColumn?: (column: ColumnType) => void;
  onDeleteColumn?: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ 
  column, 
  onAddTask, 
  onEditTask, 
  onEditColumn, 
  onDeleteColumn 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const getStatusColor = (status: string) => {
    const statusColors = {
      'todo': 'bg-gray-50 border-gray-200',
      'in-progress': 'bg-blue-50 border-blue-200',
      'done': 'bg-green-50 border-green-200',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-purple-50 border-purple-200';
  };

  return (
    <div className={`
      flex flex-col w-80 h-full border rounded-lg
      ${getStatusColor(column.status)}
      ${isOver ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}
    `}>
      <ColumnHeader
        column={column}
        onAddTask={onAddTask}
        onEditColumn={onEditColumn}
        onDeleteColumn={onDeleteColumn}
        taskCount={column.tasks.filter(task => !task.archived).length}
      />
      
      <div
        ref={setNodeRef}
        className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-200px)]"
      >
        <SortableContext
          items={column.tasks.filter(task => !task.archived).map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.filter(task => !task.archived).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
            />
          ))}
        </SortableContext>
        
        {column.tasks.filter(task => !task.archived).length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-8">
            <p>タスクがありません</p>
            <p className="text-xs mt-1">「+」ボタンで追加してください</p>
          </div>
        )}
      </div>
    </div>
  );
};