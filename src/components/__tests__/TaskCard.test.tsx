import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCard } from '../TaskCard'
import type { Task } from '../../types'

// Zustandストアのモック
vi.mock('../../stores/kanbanStore', () => ({
  useKanbanStore: () => ({
    deleteTask: vi.fn()
  })
}))

// @dnd-kit/sortableのモック
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  })
}))

describe('TaskCard', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'high',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    dueDate: new Date('2024-01-10'),
    tags: [
      { id: 'tag1', name: 'Frontend', color: '#3b82f6' },
      { id: 'tag2', name: 'Urgent', color: '#ef4444' }
    ],
    checklist: [
      { id: 'check1', text: 'Complete design', completed: true },
      { id: 'check2', text: 'Write tests', completed: false }
    ],
    archived: false
  }

  const mockOnEdit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('優先度　高')).toBeInTheDocument()
  })

  it('displays due date when present', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    
    expect(screen.getByText(/期限:/)).toBeInTheDocument()
    expect(screen.getByText(/2024\/1\/10/)).toBeInTheDocument()
  })

  it('displays tags when present', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('displays checklist progress when present', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    
    expect(screen.getByText('1/2 完了')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask)
  })

  it('shows delete confirmation when delete button is clicked', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    
    const deleteButton = screen.getByRole('button', { name: /trash/i })
    fireEvent.click(deleteButton)
    
    expect(screen.getByText('タスクを削除')).toBeInTheDocument()
    expect(screen.getByText(/\"Test Task\" を削除しますか？/)).toBeInTheDocument()
  })

  it('renders correctly without optional fields', () => {
    const minimalTask: Task = {
      id: '2',
      title: 'Minimal Task',
      status: 'todo',
      priority: 'low',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tags: [],
      checklist: [],
      archived: false
    }

    render(<TaskCard task={minimalTask} onEdit={mockOnEdit} />)
    
    expect(screen.getByText('Minimal Task')).toBeInTheDocument()
    expect(screen.getByText('優先度　低')).toBeInTheDocument()
    expect(screen.queryByText(/期限:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/完了/)).not.toBeInTheDocument()
  })

  it('applies correct priority styling', () => {
    const { container } = render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    
    // 高優先度タスクには赤いボーダーが適用される
    const taskCard = container.querySelector('.border-l-red-500')
    expect(taskCard).toBeInTheDocument()
  })
})