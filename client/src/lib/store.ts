import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Todo } from '@/types'

interface TodoStore {
  todos: Todo[]
  filter: 'all' | 'completed' | 'pending'
  searchQuery: string
  isLoading: boolean
  error: string | null
  setTodos: (todos: Todo[]) => void
  addTodo: (todo: Todo) => void
  updateTodo: (id: string, todo: Todo) => void
  deleteTodo: (id: string) => void
  setLoading: (status: boolean) => void
  setError: (error: string | null) => void
  setFilter: (filter: 'all' | 'completed' | 'pending') => void
  setSearch: (query: string) => void
  filteredTodos: () => Todo[]
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',
      searchQuery: '',
      isLoading: false,
      error: null,
      setTodos: (todos) => set({ todos }),
      addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
      updateTodo: (id, updatedTodo) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? updatedTodo : todo)),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error }),
      setFilter: (filter) => set({ filter }),
      setSearch: (searchQuery) => set({ searchQuery }),
      filteredTodos: () => {
        const state = get()
        const { todos, filter, searchQuery } = state

        return todos
          .filter((todo) => {
            if (filter === 'all') return true
            if (filter === 'completed') return todo.completed
            if (filter === 'pending') return !todo.completed
            return true
          })
          .filter((todo) =>
            todo.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
      },
    }),
    {
      name: 'todo-storage',
    }
  )
)
