"use client";

import { Todo } from "@/types";
import { useTodoStore } from "@/lib/store";
import { todoApi } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { message } from "antd";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import cn from "classnames";
import { motion, AnimatePresence } from "framer-motion";

interface TodoListProps {
  // todos: Todo[];
}

export function TodoList() {
  const { filteredTodos, updateTodo: toggleTodo, deleteTodo } = useTodoStore();
  const todos = filteredTodos();

  const [messageApi, contextHolder] = message.useMessage();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleToggle = useCallback(
    async (todo: Todo) => {
      try {
        messageApi
          .open({
            type: "loading",
            content: "Updating todo...",
            duration: 1.5,
          })
          .then(() => {
            return todoApi.updateTodo(todo.id, {
              ...todo,
              completed: !todo.completed,
            });
          })
          .then((updatedTodo) => {
            toggleTodo(todo.id, updatedTodo);
            return messageApi.success("Todo updated successfully", 2);
          });
      } catch (error) {
        messageApi.error("Failed to update todo");
      }
    },
    [toggleTodo, messageApi]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        messageApi
          .open({
            type: "loading",
            content: "Deleting todo...",
            duration: 1.5,
          })
          .then(() => {
            return todoApi.deleteTodo(id);
          })
          .then(() => {
            deleteTodo(id);
            return messageApi.success("Todo deleted successfully", 2);
          });
      } catch (error) {
        messageApi.error("Failed to delete todo");
      }
    },
    [deleteTodo, messageApi]
  );

  const handleEdit = useCallback(
    (todo: Todo) => {
      setEditingTodo(todo);
      setEditTitle(todo.title);
    },
    []
  );

  const handleSaveEdit = useCallback(async () => {
    if (!editingTodo || !editTitle.trim()) return;

    try {
      messageApi
        .open({
          type: "loading",
          content: "Updating todo...",
          duration: 1.5,
        })
        .then(() => {
          return todoApi.updateTodo(editingTodo.id, {
            ...editingTodo,
            title: editTitle.trim(),
          });
        })
        .then((updatedTodo) => {
          toggleTodo(editingTodo.id, updatedTodo);
          setEditingTodo(null);
          setEditTitle("");
          return messageApi.success("Todo updated successfully", 2);
        });
    } catch (error) {
      messageApi.error("Failed to update todo");
    }
  }, [editingTodo, editTitle, toggleTodo, messageApi]);

  if (!todos?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-primary/30 mb-4" />
        <p className="text-xl font-medium text-gray-500">
          No tasks found
        </p>
        <p className="text-sm text-gray-500/60">
          Try adjusting your search or filter
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {contextHolder}
      <motion.div layout className="space-y-4">
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group relative flex items-center justify-between p-4 rounded-xl border bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm ring-1 ring-gray-900/5 transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition duration-200" />
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggle(todo)}
                    className="relative border-primary/30 data-[state=checked]:bg-primary/90 data-[state=checked]:border-primary/90"
                  />
                </div>
                <span
                  className={cn(
                    "text-lg transition-all duration-200",
                    todo.completed
                      ? "line-through text-gray-400/60"
                      : "text-foreground"
                  )}
                >
                  {todo.title}
                </span>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(todo)}
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(todo.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Edit your task..."
              className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingTodo(null)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editTitle.trim()}
              className="bg-primary/90 hover:bg-primary"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
