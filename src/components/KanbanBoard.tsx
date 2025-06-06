import React, { useState, useMemo } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Task, Column as ColumnType } from '../types';
import { useKanbanStore } from '../stores/kanbanStore';
import { Column } from './Column';
import { TaskModal } from './TaskModal';
import { ColumnModal } from './ColumnModal';

export const KanbanBoard: React.FC = () => {
  const { columns, moveTask, reorderTasks, deleteColumn } = useKanbanStore();
  const [, setActiveTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [editingColumn, setEditingColumn] = useState<ColumnType | undefined>();
  const [modalDefaultStatus, setModalDefaultStatus] = useState<string>('todo');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // フィルタリングロジック
  const filteredColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => {
        // アーカイブフィルター
        if (!showArchived && task.archived) return false;
        if (showArchived && !task.archived) return false;
        
        // 検索フィルター
        if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !task.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // 優先度フィルター
        if (filterPriority !== 'all' && task.priority !== filterPriority) {
          return false;
        }
        
        // タグフィルター
        if (filterTag !== 'all' && !task.tags?.some(tag => tag.name === filterTag)) {
          return false;
        }
        
        return true;
      })
    }));
  }, [columns, searchTerm, filterPriority, filterTag, showArchived]);

  // 全タグの取得
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    columns.forEach(column => {
      column.tasks.forEach(task => {
        task.tags?.forEach(tag => tags.add(tag.name));
      });
    });
    return Array.from(tags);
  }, [columns]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = columns
      .flatMap(column => column.tasks)
      .find(task => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = columns.find(column =>
      column.tasks.some(task => task.id === activeId)
    );
    const overColumn = columns.find(column =>
      column.id === overId || column.tasks.some(task => task.id === overId)
    );

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id !== overColumn.id) {
      moveTask(activeId, overColumn.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = columns.find(column =>
      column.tasks.some(task => task.id === activeId)
    );

    if (!activeColumn) return;

    const isOverATask = activeColumn.tasks.some(task => task.id === overId);

    if (isOverATask) {
      const activeIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
      const overIndex = activeColumn.tasks.findIndex(task => task.id === overId);

      if (activeIndex !== overIndex) {
        const newTaskOrder = arrayMove(
          activeColumn.tasks.map(task => task.id),
          activeIndex,
          overIndex
        );
        reorderTasks(activeColumn.id, newTaskOrder);
      }
    }
  };

  const handleAddTask = (status: string) => {
    setEditingTask(undefined);
    setModalDefaultStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  };

  const handleAddColumn = () => {
    setEditingColumn(undefined);
    setIsColumnModalOpen(true);
  };

  const handleEditColumn = (column: ColumnType) => {
    setEditingColumn(column);
    setIsColumnModalOpen(true);
  };

  const handleDeleteColumn = (columnId: string) => {
    deleteColumn(columnId);
  };

  const handleCloseColumnModal = () => {
    setIsColumnModalOpen(false);
    setEditingColumn(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">カンバンボード</h1>
              <p className="text-gray-600">高機能タスク管理システム</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddColumn}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>+ カラム追加</span>
              </button>
              
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showArchived 
                    ? 'bg-orange-600 text-white hover:bg-orange-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showArchived ? 'アーカイブ表示中' : 'アーカイブ表示'}
              </button>
            </div>
          </div>
          
          {/* 検索・フィルター */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">検索</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="タスクを検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべて</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">タグ</label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべて</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterPriority('all');
                  setFilterTag('all');
                }}
                className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                フィルターをリセット
              </button>
            </div>
          </div>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            {filteredColumns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onAddTask={() => handleAddTask(column.status)}
                onEditTask={handleEditTask}
                onEditColumn={handleEditColumn}
                onDeleteColumn={handleDeleteColumn}
              />
            ))}
          </div>
        </DndContext>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          task={editingTask}
          defaultStatus={modalDefaultStatus}
        />

        <ColumnModal
          isOpen={isColumnModalOpen}
          onClose={handleCloseColumnModal}
          column={editingColumn}
        />
      </div>
    </div>
  );
};