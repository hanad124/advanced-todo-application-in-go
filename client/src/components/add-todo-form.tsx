"use client";

import { useState } from "react";
import { useTodoStore } from "@/lib/store";
import { todoApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { message } from "antd";

export function AddTodoForm() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addTodo } = useTodoStore();
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsLoading(true);
      messageApi
        .open({
          type: "loading",
          content: "Adding todo...",
          duration: 1.5,
        })
        .then(() => {
          return todoApi.createTodo({
            title: title.trim(),
            completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        })
        .then((newTodo) => {
          addTodo(newTodo);
          setTitle("");
          return messageApi.success("Todo added successfully", 2);
        });
    } catch (error) {
      messageApi.error("Failed to add todo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200" />
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="pr-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-primary/20 focus:border-primary/30 focus:ring-primary/30 h-12 text-lg placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles className="h-5 w-5 text-primary/40" />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="h-12 px-6 bg-primary/90 hover:bg-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
