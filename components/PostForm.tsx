"use client"

import { useState, useRef, useEffect } from "react"
import { X, ImageIcon, VideoIcon, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"

type PostFormProps = {
  isOpen: boolean
  onClose: () => void
  onPostCreated: () => void
}

export default function PostForm({ isOpen, onClose, onPostCreated }: PostFormProps) {
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<"image" | "video" | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setFileType(file.type.startsWith("image/") ? "image" : "video")
    } else {
      setFilePreview(null)
      setFileType(null)
    }
  }, [file])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("content", content)
    if (file) {
      formData.append("file", file)
      formData.append("fileType", fileType || "")
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast.success("Post created successfully")
        setContent("")
        setFile(null)
        onClose()
        onPostCreated()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Failed to create post")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Create New Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-32 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
          {filePreview && (
            <div className="mt-4 relative">
              {fileType === "image" ? (
                <Image
                  src={filePreview || "/placeholder.svg"}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="rounded-md object-cover w-full h-48"
                />
              ) : (
                <video src={filePreview} className="rounded-md w-full h-48" controls />
              )}
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center text-gray-600 hover:text-indigo-600"
              >
                <ImageIcon size={20} className="mr-2" />
                {file && fileType === "image" ? "Change Image" : "Add Image"}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center text-gray-600 hover:text-indigo-600"
              >
                <VideoIcon size={20} className="mr-2" />
                {file && fileType === "video" ? "Change Video" : "Add Video"}
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="hidden"
            />
            <Button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              disabled={!content.trim() && !file}
            >
              Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

