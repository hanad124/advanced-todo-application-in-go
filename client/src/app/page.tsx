"use client";

import { useEffect } from "react";
import { useTodoStore } from "@/lib/store";
import { todoApi } from "@/lib/api";
import { TodoList } from "@/components/todo-list";
import { AddTodoForm } from "@/components/add-todo-form";
import { TodoStats } from "@/components/todo-stats";
import { TodoFilters } from "@/components/todo-filters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ListTodo } from "lucide-react";

export default function Home() {
  const { todos, isLoading, error, setTodos, setLoading, setError } =
    useTodoStore();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await todoApi.getAllTodos();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [setTodos, setLoading, setError]);

  return (
    <main className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <ListTodo className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            Todo List
          </h1>
          <p className="text-xl text-gray-600">
            Organize your tasks, boost your productivity
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="animate-in fade-in-50">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg ring-1 ring-gray-900/5">
          <AddTodoForm />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <TodoStats />
            <TodoFilters />
            <TodoList todos={todos} />
          </div>
        )}
      </div>
    </main>
  );
}
