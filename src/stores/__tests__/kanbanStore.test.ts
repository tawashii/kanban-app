import { describe, it, expect, beforeEach } from 'vitest'
import { useKanbanStore } from '../kanbanStore'

describe('KanbanStore', () => {
  beforeEach(() => {
    // ストアをリセット
    useKanbanStore.getState().columns.forEach(column => {
      column.tasks = []
    })
  })

  it('should add task to correct column', () => {
    const store = useKanbanStore.getState()
    
    store.addTask({
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo',
      priority: 'high'
    })

    const todoColumn = store.columns.find(col => col.status === 'todo')
    expect(todoColumn?.tasks).toHaveLength(1)
    expect(todoColumn?.tasks[0].title).toBe('Test Task')
    expect(todoColumn?.tasks[0].priority).toBe('high')
  })

  it('should update task correctly', () => {
    const store = useKanbanStore.getState()
    
    // タスクを追加
    store.addTask({
      title: 'Original Title',
      description: 'Original Description',
      status: 'todo',
      priority: 'medium'
    })

    const todoColumn = store.columns.find(col => col.status === 'todo')
    const taskId = todoColumn?.tasks[0].id!

    // タスクを更新
    store.updateTask(taskId, {
      title: 'Updated Title',
      priority: 'high'
    })

    const updatedTask = todoColumn?.tasks[0]
    expect(updatedTask?.title).toBe('Updated Title')
    expect(updatedTask?.priority).toBe('high')
    expect(updatedTask?.description).toBe('Original Description') // 変更されていない項目は保持
  })

  it('should delete task correctly', () => {
    const store = useKanbanStore.getState()
    
    // タスクを追加
    store.addTask({
      title: 'Task to Delete',
      description: 'This will be deleted',
      status: 'todo',
      priority: 'low'
    })

    const todoColumn = store.columns.find(col => col.status === 'todo')
    const taskId = todoColumn?.tasks[0].id!
    
    expect(todoColumn?.tasks).toHaveLength(1)

    // タスクを削除
    store.deleteTask(taskId)
    
    expect(todoColumn?.tasks).toHaveLength(0)
  })

  it('should move task between columns', () => {
    const store = useKanbanStore.getState()
    
    // todoカラムにタスクを追加
    store.addTask({
      title: 'Task to Move',
      description: 'Moving to in-progress',
      status: 'todo',
      priority: 'medium'
    })

    const todoColumn = store.columns.find(col => col.status === 'todo')
    const inProgressColumn = store.columns.find(col => col.status === 'in-progress')
    const taskId = todoColumn?.tasks[0].id!

    expect(todoColumn?.tasks).toHaveLength(1)
    expect(inProgressColumn?.tasks).toHaveLength(0)

    // タスクをin-progressに移動
    store.moveTask(taskId, 'in-progress')

    expect(todoColumn?.tasks).toHaveLength(0)
    expect(inProgressColumn?.tasks).toHaveLength(1)
    expect(inProgressColumn?.tasks[0].status).toBe('in-progress')
    expect(inProgressColumn?.tasks[0].title).toBe('Task to Move')
  })

  it('should add new column', () => {
    const store = useKanbanStore.getState()
    const initialColumnCount = store.columns.length

    store.addColumn('New Column')

    expect(store.columns).toHaveLength(initialColumnCount + 1)
    const newColumn = store.columns[store.columns.length - 1]
    expect(newColumn.title).toBe('New Column')
    expect(newColumn.status).toBe('new-column')
    expect(newColumn.tasks).toHaveLength(0)
  })

  it('should update column', () => {
    const store = useKanbanStore.getState()
    const columnId = store.columns[0].id

    store.updateColumn(columnId, {
      title: 'Updated Column',
      color: '#ff0000'
    })

    const updatedColumn = store.columns.find(col => col.id === columnId)
    expect(updatedColumn?.title).toBe('Updated Column')
    expect(updatedColumn?.color).toBe('#ff0000')
  })

  it('should delete column', () => {
    const store = useKanbanStore.getState()
    const initialColumnCount = store.columns.length
    const columnToDelete = store.columns[0]

    store.deleteColumn(columnToDelete.id)

    expect(store.columns).toHaveLength(initialColumnCount - 1)
    expect(store.columns.find(col => col.id === columnToDelete.id)).toBeUndefined()
  })

  it('should duplicate task', () => {
    const store = useKanbanStore.getState()
    
    // タスクを追加
    store.addTask({
      title: 'Original Task',
      description: 'To be duplicated',
      status: 'todo',
      priority: 'high'
    })

    const todoColumn = store.columns.find(col => col.status === 'todo')
    const originalTaskId = todoColumn?.tasks[0].id!

    expect(todoColumn?.tasks).toHaveLength(1)

    // タスクを複製
    store.duplicateTask(originalTaskId)

    expect(todoColumn?.tasks).toHaveLength(2)
    const duplicatedTask = todoColumn?.tasks[1]
    expect(duplicatedTask.title).toBe('Original Task (コピー)')
    expect(duplicatedTask.description).toBe('To be duplicated')
    expect(duplicatedTask.priority).toBe('high')
    expect(duplicatedTask.id).not.toBe(originalTaskId)
  })

  it('should archive and restore task', () => {
    const store = useKanbanStore.getState()
    
    // タスクを追加
    store.addTask({
      title: 'Task to Archive',
      description: 'Will be archived',
      status: 'todo',
      priority: 'medium'
    })

    const todoColumn = store.columns.find(col => col.status === 'todo')
    const taskId = todoColumn?.tasks[0].id!

    expect(todoColumn?.tasks[0].archived).toBe(false)

    // タスクをアーカイブ
    store.archiveTask(taskId)
    
    expect(todoColumn?.tasks[0].archived).toBe(true)

    // タスクを復元
    store.restoreTask(taskId)
    
    expect(todoColumn?.tasks[0].archived).toBe(false)
  })
})