import axios from "axios";
import { Todo } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const todoApi = {
  getAllTodos: async () => {
    const response = await api.get<{
      data: { todos: Todo[] };
      success: boolean;
    }>("/todos");
    return response.data.data.todos;
  },

  createTodo: async (todo: Partial<Todo>) => {
    const response = await api.post<{ data: Todo; success: boolean }>(
      "/todos",
      {
        ...todo,
        completed: todo.completed ?? false,
        created_at: todo.created_at ?? new Date().toISOString(),
        updated_at: todo.updated_at ?? new Date().toISOString(),
      }
    );

    console.log("response:", response);
    return response.data.data.todo;
  },

  updateTodo: async (id: string, todo: Partial<Todo>) => {
    const response = await api.put<{ data: Todo; success: boolean }>(
      `/todos/${id}`,
      todo
    );
    return response.data.data.todo;
  },

  deleteTodo: async (id: string) => {
    const response = await api.delete<{ data: null; success: boolean }>(
      `/todos/${id}`
    );
    console.log("response:", response);
    return response.data.data;
  },

  getTodo: async (id: string) => {
    const response = await api.get<{ data: Todo; success: boolean }>(
      `/todos/${id}`
    );
    return response.data.data.todo;
  },
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    throw new Error(message);
  }
);
