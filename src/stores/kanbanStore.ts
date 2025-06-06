import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Task, Column } from '../types';

interface KanbanStore {
  columns: Column[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'tags' | 'checklist' | 'archived'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: string) => void;
  reorderTasks: (columnId: string, taskIds: string[]) => void;
  addColumn: (title: string) => void;
  updateColumn: (id: string, updates: Partial<Column>) => void;
  deleteColumn: (id: string) => void;
  duplicateTask: (id: string) => void;
  archiveTask: (id: string) => void;
  restoreTask: (id: string) => void;
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    status: 'todo',
    tasks: [],
    position: 0
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    status: 'in-progress',
    tasks: [],
    position: 1
  },
  {
    id: 'done',
    title: 'Done',
    status: 'done',
    tasks: [],
    position: 2
  }
];

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      columns: initialColumns,
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [],
          checklist: [],
          archived: false
        };
        
        set((state) => ({
          columns: state.columns.map((column) =>
            column.status === taskData.status
              ? { ...column, tasks: [...column.tasks, newTask] }
              : column
          )
        }));
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          columns: state.columns.map((column) => ({
            ...column,
            tasks: column.tasks.map((task) =>
              task.id === id
                ? { ...task, ...updates, updatedAt: new Date() }
                : task
            )
          }))
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          columns: state.columns.map((column) => ({
            ...column,
            tasks: column.tasks.filter((task) => task.id !== id)
          }))
        }));
      },
      
      moveTask: (taskId, newStatus) => {
        const { columns } = get();
        let taskToMove: Task | null = null;
        
        // Find and remove the task from its current column
        const updatedColumns = columns.map((column) => {
          const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
          if (taskIndex !== -1) {
            taskToMove = { ...column.tasks[taskIndex], status: newStatus, updatedAt: new Date() };
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId)
            };
          }
          return column;
        });
        
        // Add the task to the new column
        if (taskToMove) {
          const finalColumns = updatedColumns.map((column) =>
            column.status === newStatus
              ? { ...column, tasks: [...column.tasks, taskToMove as Task] }
              : column
          );
          
          set({ columns: finalColumns });
        }
      },
      
      reorderTasks: (columnId, taskIds) => {
        set((state) => ({
          columns: state.columns.map((column) => {
            if (column.id === columnId) {
              const reorderedTasks = taskIds.map((id) =>
                column.tasks.find((task) => task.id === id)!
              );
              return { ...column, tasks: reorderedTasks };
            }
            return column;
          })
        }));
      },
      
      addColumn: (title) => {
        const newColumn: Column = {
          id: crypto.randomUUID(),
          title,
          status: title.toLowerCase().replace(/\s+/g, '-'),
          tasks: [],
          position: get().columns.length
        };
        
        set((state) => ({
          columns: [...state.columns, newColumn].sort((a, b) => a.position - b.position)
        }));
      },
      
      updateColumn: (id, updates) => {
        set((state) => ({
          columns: state.columns.map((column) =>
            column.id === id ? { ...column, ...updates } : column
          )
        }));
      },
      
      deleteColumn: (id) => {
        set((state) => ({
          columns: state.columns.filter((column) => column.id !== id)
        }));
      },
      
      duplicateTask: (id) => {
        const { columns } = get();
        let taskToDuplicate: Task | null = null;
        let targetColumnStatus: string | null = null;
        
        for (const column of columns) {
          const task = column.tasks.find(t => t.id === id);
          if (task) {
            taskToDuplicate = task;
            targetColumnStatus = column.status;
            break;
          }
        }
        
        if (taskToDuplicate && targetColumnStatus) {
          const duplicatedTask: Task = {
            ...taskToDuplicate,
            id: crypto.randomUUID(),
            title: `${taskToDuplicate.title} (コピー)`,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          set((state) => ({
            columns: state.columns.map((column) =>
              column.status === targetColumnStatus
                ? { ...column, tasks: [...column.tasks, duplicatedTask] }
                : column
            )
          }));
        }
      },
      
      archiveTask: (id) => {
        set((state) => ({
          columns: state.columns.map((column) => ({
            ...column,
            tasks: column.tasks.map((task) =>
              task.id === id ? { ...task, archived: true } : task
            )
          }))
        }));
      },
      
      restoreTask: (id) => {
        set((state) => ({
          columns: state.columns.map((column) => ({
            ...column,
            tasks: column.tasks.map((task) =>
              task.id === id ? { ...task, archived: false } : task
            )
          }))
        }));
      }
    }),
    {
      name: 'kanban-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ columns: state.columns }),
    }
  )
);