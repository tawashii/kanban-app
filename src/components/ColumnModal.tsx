import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import type { Column } from '../types';
import { useKanbanStore } from '../stores/kanbanStore';

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  column?: Column;
}

export const ColumnModal: React.FC<ColumnModalProps> = ({ 
  isOpen, 
  onClose, 
  column 
}) => {
  const addColumn = useKanbanStore((state) => state.addColumn);
  const updateColumn = useKanbanStore((state) => state.updateColumn);
  
  const [formData, setFormData] = useState({
    title: '',
    color: '#6366f1',
  });

  useEffect(() => {
    if (column) {
      setFormData({
        title: column.title,
        color: column.color || '#6366f1',
      });
    } else {
      setFormData({
        title: '',
        color: '#6366f1',
      });
    }
  }, [column, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    if (column) {
      updateColumn(column.id, formData);
    } else {
      addColumn(formData.title);
      // 新しく作成されたカラムにカラーを適用するため、少し待ってから更新
      setTimeout(() => {
        const newColumns = useKanbanStore.getState().columns;
        const newColumn = newColumns[newColumns.length - 1];
        if (newColumn && formData.color !== '#6366f1') {
          updateColumn(newColumn.id, { color: formData.color });
        }
      }, 100);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const predefinedColors = [
    '#6366f1', // indigo
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#84cc16', // lime
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {column ? 'カラムを編集' : '新しいカラム'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              カラム名 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="カラム名を入力"
              required
            />
          </div>
          
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
              カラー
            </label>
            <div className="space-y-3">
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
              />
              
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-full h-8 rounded-md border-2 transition-all ${
                      formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {column ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};