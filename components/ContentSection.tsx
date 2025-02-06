"use client"

import { motion } from "framer-motion"
import { Share2, MoreHorizontal, Edit, Trash } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"
import { jwtDecode } from "jwt-decode"

interface Highlight {
  id: number
  youtubeLink: string
  caption: string
  description: string
}

interface Post {
  id: number
  author: string
  authorId: number
  avatar: string
  mediaUrl: string
  mediaType: "image" | "video"
  caption: string
}

export interface ContentSectionRef {
  fetchPosts: () => Promise<void>
}

interface ContentSectionProps {}

const ContentSection = forwardRef<ContentSectionRef, ContentSectionProps>((props, ref) => {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [editingHighlight, setEditingHighlight] = useState<Highlight | null>(null)
  const [isPostFormOpen, setIsPostFormOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    fetchHighlights()
    fetchPosts()
    getCurrentUser()
  }, [])

  useImperativeHandle(ref, () => ({
    fetchPosts
  }))

  const fetchHighlights = async () => {
    try {
      const response = await fetch("/api/highlights")
      const data = await response.json()
      setHighlights(data)
    } catch (error) {
      console.error("Error fetching highlights:", error)
      toast.error("Failed to fetch highlights")
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast.error("Failed to fetch posts")
    }
  }

  const getCurrentUser = () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decodedToken = jwtDecode<{ userId: number }>(token)
        setCurrentUserId(decodedToken.userId)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }

  const handleEditHighlight = async () => {
    if (!editingHighlight) return
    try {
      const response = await fetch(`/api/highlights/${editingHighlight.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingHighlight),
      })
      if (response.ok) {
        toast.success("Highlight updated successfully")
        fetchHighlights()
        setEditingHighlight(null)
      } else {
        toast.error("Failed to update highlight")
      }
    } catch (error) {
      console.error("Error updating highlight:", error)
      toast.error("Failed to update highlight")
    }
  }

  const handleDeleteHighlight = async (id: number) => {
    try {
      const response = await fetch(`/api/highlights/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Highlight deleted successfully")
        fetchHighlights()
      } else {
        toast.error("Failed to delete highlight")
      }
    } catch (error) {
      console.error("Error deleting highlight:", error)
      toast.error("Failed to delete highlight")
    }
  }

  const handleDeletePost = async (postId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error("Please login to delete posts")
        return
      }

      const response = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Try to parse the response as JSON only if there's content
      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      }

      if (!response.ok) {
        toast.error(data?.error || 'Failed to delete post')
        return
      }

      toast.success('Post deleted successfully')
      await fetchPosts() // Refresh the posts list
    } catch (err) {
      console.error('Error deleting post:', err)
      toast.error('Failed to delete post')
    }
  }

  const handlePostCreated = () => {
    fetchPosts() // Refresh posts after a new post is created
    setIsPostFormOpen(false)
  }

  const handleSharePost = (postId: number) => {
    const postUrl = `${window.location.origin}/post/${postId}`
    navigator.clipboard.writeText(postUrl)
    toast.success("Post link copied to clipboard")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Highlights</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {highlights.map((highlight) => (
            <motion.div
              key={highlight.id}
              className="flex-shrink-0 w-64 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <iframe
                width="256"
                height="144"
                src={highlight.youtubeLink}
                title={highlight.caption}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full rounded-lg mb-2"
              ></iframe>
              <p className="text-sm font-semibold text-gray-700 truncate">{highlight.caption}</p>
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button size="icon" variant="ghost" onClick={() => setEditingHighlight(highlight)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDeleteHighlight(highlight.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        {editingHighlight && (
          <Dialog open={!!editingHighlight} onOpenChange={() => setEditingHighlight(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Highlight</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="YouTube Embed Link"
                  value={editingHighlight.youtubeLink}
                  onChange={(e) => setEditingHighlight({ ...editingHighlight, youtubeLink: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={editingHighlight.description}
                  onChange={(e) => setEditingHighlight({ ...editingHighlight, description: e.target.value })}
                />
                <Button onClick={handleEditHighlight}>Update Highlight</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="border-t border-gray-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Posts</h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-gray-50 rounded-lg shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={post.avatar || "/placeholder.svg"}
                      alt={post.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-semibold text-gray-800">{post.author}</span>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </div>
                {post.mediaType === "image" ? (
                  <Image
                    src={post.mediaUrl || "/placeholder.svg"}
                    alt="Post image"
                    width={400}
                    height={400}
                    className="w-full object-cover"
                  />
                ) : (
                  <video src={post.mediaUrl} className="w-full" controls />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <button
                      onClick={() => handleSharePost(post.id)}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <Share2 className="w-5 h-5 mr-1" />
                      Share
                    </button>
                    {currentUserId === post.authorId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{post.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
})

export default ContentSection
