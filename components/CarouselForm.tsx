import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"

export default function CarouselForm({ onCarouselItemAdded }: { onCarouselItemAdded: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [alt, setAlt] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        const newCarouselItem = await response.json()
        toast.success("Carousel item added successfully")
        setFile(null)
        setAlt("")
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
    </form>
  )
}

