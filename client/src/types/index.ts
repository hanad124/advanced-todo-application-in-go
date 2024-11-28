
interface TodoData {
  id: string
  title: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface Todo {
  id: string
  title: string
  completed: boolean
  created_at: string
  updated_at: string
  
  todo: TodoData
}

export interface TodoFormData {
  title: string
}
