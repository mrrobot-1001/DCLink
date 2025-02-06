"use client"

import { useState, useRef, useEffect } from "react"
import { X, ImageIcon, VideoIcon, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

type PostFormProps = {
  isOpen: boolean
  onClose: () => void
  onPostCreated: () => void
}

export default function PostForm({ isOpen, onClose, onPostCreated }: PostFormProps) {
  const [caption, setCaption] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<"image" | "video" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    
    try {
      setIsSubmitting(true)
      
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error("Please login to create a post")
        return
      }

      if (!file) {
        toast.error("Please select a file to upload")
        return
      }

      if (!caption.trim()) {
        toast.error("Please enter a caption")
        return
      }

      const formData = new FormData()
      formData.append("caption", caption)
      formData.append("file", file)
      formData.append("fileType", fileType || "")

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Post created successfully")
        setCaption("")
        setFile(null)
        onClose()
        onPostCreated()
      } else {
        toast.error(data.error || "Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Failed to create post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB")
        return
      }

      // Check file type
      if (!selectedFile.type.startsWith("image/") && !selectedFile.type.startsWith("video/")) {
        toast.error("Only image and video files are allowed")
        return
      }

      setFile(selectedFile)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Post</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 border rounded mb-4 resize-none"
            rows={4}
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {!file ? (
            <div className="border-2 border-dashed rounded-lg p-4 text-center mb-4">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center space-x-2 mx-auto"
              >
                <ImageIcon className="h-6 w-6" />
                <VideoIcon className="h-6 w-6" />
                <span>Upload Image or Video</span>
              </button>
            </div>
          ) : (
            <div className="relative mb-4">
              {fileType === "image" ? (
                <Image
                  src={filePreview!}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              ) : (
                <video src={filePreview!} className="w-full rounded-lg" controls />
              )}
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </div>
    </div>
  )
}
