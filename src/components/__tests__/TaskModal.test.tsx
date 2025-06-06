import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskModal } from '../TaskModal'
import type { Task } from '../../types'

// Zustandストアのモック
const mockAddTask = vi.fn()
const mockUpdateTask = vi.fn()

vi.mock('../../stores/kanbanStore', () => ({
  useKanbanStore: () => ({
    addTask: mockAddTask,
    updateTask: mockUpdateTask
  })
}))

describe('TaskModal', () => {
  const mockOnClose = vi.fn()
  
  const existingTask: Task = {
    id: '1',
    title: 'Existing Task',
    description: 'Existing Description',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    dueDate: new Date('2024-01-15'),
    tags: [
      { id: 'tag1', name: 'Backend', color: '#10b981' }
    ],
    checklist: [
      { id: 'check1', text: 'Setup database', completed: true }
    ],
    archived: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    render(
      <TaskModal
        isOpen={false}
        onClose={mockOnClose}
        defaultStatus="todo"
      />
    )
    
    expect(screen.queryByText('新しいタスク')).not.toBeInTheDocument()
  })

  it('renders create modal when no task is provided', () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        defaultStatus="todo"
      />
    )
    
    expect(screen.getByText('新しいタスク')).toBeInTheDocument()
    expect(screen.getByDisplayValue('To Do')).toBeInTheDocument()
  })

  it('renders edit modal when task is provided', () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        task={existingTask}
        defaultStatus="todo"
      />
    )
    
    expect(screen.getByText('タスクを編集')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument()
  })

  it('creates new task when form is submitted', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        defaultStatus="todo"
      />
    )
    
    await user.type(screen.getByPlaceholderText('タスクのタイトルを入力'), 'New Task')
    await user.type(screen.getByPlaceholderText('タスクの詳細説明（任意）'), 'New Description')
    await user.selectOptions(screen.getByDisplayValue('中'), '高')
    
    await user.click(screen.getByRole('button', { name: '作成' }))
    
    expect(mockAddTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Task',
        description: 'New Description',
        priority: 'high',
        status: 'todo'
      })
    )
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('updates existing task when form is submitted', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        task={existingTask}
        defaultStatus="todo"
      />
    )
    
    const titleInput = screen.getByDisplayValue('Existing Task')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Task')
    
    await user.click(screen.getByRole('button', { name: '更新' }))
    
    expect(mockUpdateTask).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        title: 'Updated Task'
      })
    )
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('adds tags correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        defaultStatus="todo"
      />
    )
    
    const tagInput = screen.getByPlaceholderText('新しいタグを追加')
    await user.type(tagInput, 'Frontend')
    await user.click(screen.getByRole('button', { name: 'Plus' }))
    
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(tagInput).toHaveValue('')
  })

  it('adds checklist items correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        defaultStatus="todo"
      />
    )
    
    const checklistInput = screen.getByPlaceholderText('チェックリスト項目を追加')
    await user.type(checklistInput, 'Review code')
    await user.click(screen.getAllByRole('button', { name: 'Plus' })[1])
    
    expect(screen.getByText('Review code')).toBeInTheDocument()
    expect(checklistInput).toHaveValue('')
  })

  it('sets due date correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        defaultStatus="todo"
      />
    )
    
    const dueDateInput = screen.getByLabelText(/期限/)
    await user.type(dueDateInput, '2024-01-20')
    
    expect(dueDateInput).toHaveValue('2024-01-20')
  })

  it('closes modal when cancel button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        defaultStatus="todo"
      />
    )
    
    await user.click(screen.getByRole('button', { name: 'キャンセル' }))
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('prevents submission with empty title', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        defaultStatus="todo"
      />
    )
    
    await user.click(screen.getByRole('button', { name: '作成' }))
    
    expect(mockAddTask).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('toggles checklist item completion', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        task={existingTask}
        defaultStatus="todo"
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
    
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('removes tags and checklist items', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        task={existingTask}
        defaultStatus="todo"
      />
    )
    
    // タグを削除
    const tagRemoveButton = screen.getByRole('button', { name: 'X' })
    await user.click(tagRemoveButton)
    
    expect(screen.queryByText('Backend')).not.toBeInTheDocument()
    
    // チェックリスト項目を削除
    const checklistRemoveButton = screen.getByRole('button', { name: 'Trash2' })
    await user.click(checklistRemoveButton)
    
    expect(screen.queryByText('Setup database')).not.toBeInTheDocument()
  })
})