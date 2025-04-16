"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { GripVertical, X } from "lucide-react"
import { motion } from "framer-motion"

interface PriorityItem {
  id: string
  text: string
}

const PrioritySelector = () => {
  const [items, setItems] = useState<PriorityItem[]>([
    { id: "1", text: "Course Duration" },
    { id: "2", text: "Course Content Quality" },
    { id: "3", text: "Instructor Experience" },
    { id: "4", text: "Price and Value" },
    { id: "5", text: "Student Reviews" },
    { id: "6", text: "Career Opportunities" },
  ])

  const [selectedItems, setSelectedItems] = useState<PriorityItem[]>([])
  const [draggedItem, setDraggedItem] = useState<PriorityItem | null>(null)
  const [dragSource, setDragSource] = useState<"list" | "selected" | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Store selectedItems in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("priorities", JSON.stringify(selectedItems))
  }, [selectedItems])

  const handleDragStart = (item: PriorityItem, source: "list" | "selected", index?: number, e?: React.DragEvent) => {
    setDraggedItem(item)
    setDragSource(source)
    if (index !== undefined) {
      setDraggedIndex(index)
    }

    if (e && e.dataTransfer) {
      const dragImage = document.createElement("div")
      dragImage.style.position = "absolute"
      dragImage.style.top = "-9999px"
      dragImage.style.left = "-9999px"
      dragImage.style.padding = "8px"
      dragImage.style.backgroundColor = "white"
      dragImage.style.border = "1px solid #e5e7eb"
      dragImage.style.borderRadius = "8px"
      dragImage.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"
      dragImage.innerText = item.text
      document.body.appendChild(dragImage)
      e.dataTransfer.setDragImage(dragImage, 0, 0)
      setTimeout(() => document.body.removeChild(dragImage), 0)
    }
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (!draggedItem) return

    const newSelectedItems = [...selectedItems]

    if (dragSource === "list") {
      if (selectedItems.length < 3 && !selectedItems.find((item) => item.id === draggedItem.id)) {
        newSelectedItems.splice(index, 0, draggedItem)
        if (newSelectedItems.length > 3) {
          newSelectedItems.pop()
        }
      }
    } else if (dragSource === "selected" && draggedIndex !== null) {
      newSelectedItems.splice(draggedIndex, 1)
      newSelectedItems.splice(index, 0, draggedItem)
    }

    setSelectedItems(newSelectedItems)
    setDraggedItem(null)
    setDragSource(null)
    setDraggedIndex(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeSelected = (itemToRemove: PriorityItem) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemToRemove.id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">Course Priorities</h1>
            <p className="text-gray-500 text-sm">Select and arrange your top 3 priorities when choosing a course</p>
          </div>

          <div className="space-y-4">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                className={`group h-12 rounded-lg transition-all duration-200 ${
                  selectedItems[index]
                    ? "bg-white shadow-sm ring-1 ring-gray-200"
                    : "bg-gray-50 border border-gray-200 border-dashed"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {selectedItems[index] ? (
                  <div
                    className="flex items-center justify-between w-full h-full px-3 cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => handleDragStart(selectedItems[index], "selected", index, e)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-400">{index + 1}</span>
                      <GripVertical
                        className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        size={14}
                      />
                      <span className="font-medium text-sm text-gray-700">{selectedItems[index].text}</span>
                    </div>
                    <button
                      onClick={() => removeSelected(selectedItems[index])}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">
                    Drop priority here
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-12 space-y-4">
            <h2 className="text-lg font-medium text-gray-700">Available Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item, index) => {
                const isSelected = selectedItems.some((selected) => selected.id === item.id)
                return (
                  <motion.div
                    key={item.id}
                    draggable={!isSelected}
                    onDragStart={(e) => handleDragStart(item, "list", undefined)}
                    className={`group transition-all duration-300 ease-in-out ${
                      isSelected
                        ? "opacity-50 cursor-not-allowed"
                        : `cursor-grab active:cursor-grabbing hover:bg-gray-50 ${
                            index % 2 === 0 ? "animate-floatEven" : "animate-floatOdd"
                          }`
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-shadow duration-200 hover:shadow-md">
                      <GripVertical
                        className={`text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isSelected ? "hidden" : ""
                        }`}
                        size={16}
                      />
                      <span className={`text-sm ${isSelected ? "text-gray-400" : "text-gray-600"}`}>{item.text}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrioritySelector