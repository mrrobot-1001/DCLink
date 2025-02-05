"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"
import { Trash2 } from "lucide-react"
import Image from "next/image"

export default function CarouselForm({
  onCarouselItemAdded,
  onCarouselItemDeleted,
}: { onCarouselItemAdded: () => void; onCarouselItemDeleted: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [alt, setAlt] = useState("")
  const [carouselItems, setCarouselItems] = useState<Array<{ id: number; src: string; alt: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchCarouselItems()
  }, [])

  const fetchCarouselItems = async () => {
    try {
      const response = await fetch("/api/carousel")
      if (response.ok) {
        const data = await response.json()
        setCarouselItems(data.map((item: any) => ({
          ...item,
          src: item.src.startsWith('http') ? item.src : `${window.location.origin}${item.src}`
        })))
      }
    } catch (error) {
      console.error("Error fetching carousel items:", error)
      toast.error("Failed to fetch carousel items")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast.error("Please select an image")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", "image")
    formData.append("alt", alt)

    try {
      const response = await fetch("/api/carousel", {
        method: "POST",
        body: formData,
      })
      if (response.ok) {
        toast.success("Carousel item added successfully")
        setFile(null)
        setAlt("")
        fetchCarouselItems() // Refresh the list after adding
        onCarouselItemAdded()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to add carousel item")
      }
    } catch (error) {
      console.error("Error adding carousel item:", error)
      toast.error("Failed to add carousel item")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("You must be logged in to delete carousel items")
        return
      }

      const response = await fetch(`/api/carousel/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete carousel item")
      }

      // Update local state only after successful deletion
      setCarouselItems(prevItems => prevItems.filter(item => item.id !== id))
      toast.success("Carousel item deleted successfully")
      onCarouselItemDeleted()
    } catch (error) {
      console.error("Error deleting carousel item:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete carousel item")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {file ? <p>{file.name}</p> : <p>Click to select or drag and drop an image here</p>}
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <Input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Alt Text" />
      <Button type="submit">Add Carousel Item</Button>

      {/* Display existing carousel items with delete button */}
      <div className="mt-4 space-y-4">
        <h3 className="text-lg font-semibold mb-2">Existing Carousel Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carouselItems.map((item) => (
            <div key={item.id} className="relative group h-48">
              <div className="relative w-full h-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">{item.alt}</p>
            </div>
          ))}
        </div>
      </div>
    </form>
  )
}
