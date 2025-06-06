import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiTrash2, FiEdit3, FiClock, FiCalendar, FiCheckSquare } from 'react-icons/fi';
import type { Task } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { useKanbanStore } from '../stores/kanbanStore';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const deleteTask = useKanbanStore((state) => state.deleteTask);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  
  const handleDeleteConfirm = () => {
    deleteTask(task.id);
  };
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500',
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    const labels = {
      low: '低',
      medium: '中', 
      high: '高'
    };
    return labels[priority];
  };

  return (
    <>
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white border-l-4 ${priorityColors[task.priority]} 
        rounded-lg shadow-sm p-4 mb-3 cursor-grab
        hover:shadow-md transition-shadow duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-5">
          {task.title}
        </h3>
        <div className="flex space-x-1 ml-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <FiEdit3 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {/* 期限表示 */}
      {task.dueDate && (
        <div className="flex items-center space-x-1 text-xs text-orange-600 mb-2">
          <FiCalendar size={12} />
          <span>期限: {new Date(task.dueDate).toLocaleDateString('ja-JP')}</span>
        </div>
      )}
      
      {/* タグ表示 */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs rounded-full text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      
      {/* チェックリスト進捗 */}
      {task.checklist && task.checklist.length > 0 && (
        <div className="flex items-center space-x-1 text-xs text-gray-600 mb-2">
          <FiCheckSquare size={12} />
          <span>
            {task.checklist.filter(item => item.completed).length}/{task.checklist.length} 完了
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${task.priority === 'high' ? 'bg-red-100 text-red-800' : 
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-green-100 text-green-800'}
        `}>
          優先度　{getPriorityLabel(task.priority)}
        </span>
        
        <div className="flex items-center space-x-1">
          <FiClock size={12} />
          <span>{formatDate(task.updatedAt)}</span>
        </div>
      </div>
    </div>
    
    <ConfirmModal
      isOpen={showDeleteConfirm}
      onClose={() => setShowDeleteConfirm(false)}
      onConfirm={handleDeleteConfirm}
      title="タスクを削除"
      message={`"${task.title}" を削除しますか？この操作は取り消せません。`}
      confirmText="削除"
      type="danger"
    />
    </>
  );
};