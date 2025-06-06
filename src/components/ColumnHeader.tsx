import React, { useState } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiMoreHorizontal } from 'react-icons/fi';
import type { Column } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface ColumnHeaderProps {
  column: Column;
  onAddTask: () => void;
  onEditColumn?: (column: Column) => void;
  onDeleteColumn?: (columnId: string) => void;
  taskCount: number;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  taskCount
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusColors = {
    'todo': 'text-gray-700 bg-gray-100',
    'in-progress': 'text-blue-700 bg-blue-100',
    'done': 'text-green-700 bg-green-100',
  };

  const getDefaultColor = (status: string) => {
    if (status in statusColors) {
      return statusColors[status as keyof typeof statusColors];
    }
    return 'text-purple-700 bg-purple-100';
  };

  const handleDeleteColumn = () => {
    if (onDeleteColumn) {
      onDeleteColumn(column.id);
    }
  };

  return (
    <>
      <div className={`
        flex items-center justify-between p-4 border-b
        ${column.color ? '' : getDefaultColor(column.status)} rounded-t-lg
      `} style={column.color ? { backgroundColor: column.color, color: 'white' } : {}}>
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-sm">{column.title}</h2>
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: column.color ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
              color: column.color ? 'white' : 'inherit'
            }}
          >
            {taskCount}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={onAddTask}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            title="タスクを追加"
          >
            <FiPlus size={16} />
          </button>
          
          {(onEditColumn || onDeleteColumn) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                title="カラム設定"
              >
                <FiMoreHorizontal size={16} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
                  {onEditColumn && (
                    <button
                      onClick={() => {
                        onEditColumn(column);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FiEdit3 size={14} />
                      <span>編集</span>
                    </button>
                  )}
                  {onDeleteColumn && (
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <FiTrash2 size={14} />
                      <span>削除</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteColumn}
        title="カラムを削除"
        message={`"${column.title}" とその中のすべてのタスクを削除しますか？この操作は取り消せません。`}
        confirmText="削除"
        type="danger"
      />
    </>
  );
};