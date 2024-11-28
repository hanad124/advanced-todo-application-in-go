"use client";

import { useTodoStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

export function TodoStats() {
  const { todos } = useTodoStore();

  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent" />
      <div className="absolute inset-0 bg-grid-white/10" />
      <CardHeader className="relative">
        <div className="flex items-center space-x-2">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-xl">
            <BarChart2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-primary">Task Progress</CardTitle>
            <CardDescription className="text-gray-400">
              Track your productivity
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <motion.span
              key={progress}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-medium text-primary"
            >
              {progress}%
            </motion.span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-primary/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-gray-400">Completed</span>
            </div>
            <motion.p
              key={completed}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              {completed}
            </motion.p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Circle className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Pending</span>
            </div>
            <motion.p
              key={pending}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              {pending}
            </motion.p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
