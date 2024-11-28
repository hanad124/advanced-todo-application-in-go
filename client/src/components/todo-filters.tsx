'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTodoStore } from "@/lib/store"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function TodoFilters() {
  const [search, setSearch] = useState("")
  const { setFilter, filter, setSearch: setStoreSearch } = useTodoStore()

  const handleSearch = (value: string) => {
    setSearch(value)
    setStoreSearch(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row gap-4 mb-6"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 bg-white dark:bg-gray-950 glass-morphism"
        />
        <AnimatePresence>
          {search && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-3 w-3 text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-950 glass-morphism">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <SelectValue placeholder="Filter tasks" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  )
}
