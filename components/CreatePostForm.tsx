import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"

type PostType = "text" | "video" | "blog"

export default function CreatePostForm({ onPostCreated }: { onPostCreated: () => void }) {
  const [postType, setPostType] = useState<PostType>("text")
  const [content, setContent] = useState("")
  const [caption, setCaption] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: postType,
          content: postType === "video" ? videoUrl : content,
          caption,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Post created successfully")
        setContent("")
        setCaption("")
        setVideoUrl("")
        onPostCreated()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Failed to create post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select value={postType} onValueChange={(value: PostType) => setPostType(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select post type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="video">Video</SelectItem>
          <SelectItem value="blog">Blog</SelectItem>
        </SelectContent>
      </Select>

      {postType === "video" ? (
        <Input
          type="url"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
        />
      ) : (
        <Textarea
          placeholder={postType === "blog" ? "Write your blog post" : "What's on your mind?"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      )}

      <Input
        type="text"
        placeholder="Caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Post"}
      </Button>
    </form>
  )
}

