"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2, Plus, Youtube, Upload } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"

type User = {
  id: number
  username: string
  email: string
  stream: string
  session: string
}

type Highlight = {
  id: number
  title: string
  image: string
  youtubeLink: string
}

type GalleryImage = {
  id: number
  src: string
  alt: string
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [streamFilter, setStreamFilter] = useState("")
  const [sessionFilter, setSessionFilter] = useState("")
  const [newHighlight, setNewHighlight] = useState({ title: "", youtubeLink: "" })
  const [newImage, setNewImage] = useState<File | null>(null)
  const [imageAlt, setImageAlt] = useState("")

  useEffect(() => {
    fetchUsers()
    fetchHighlights()
    fetchGalleryImages()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, streamFilter, sessionFilter])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    }
  }

  const fetchHighlights = async () => {
    // Implement API call to fetch highlights
  }

  const fetchGalleryImages = async () => {
    // Implement API call to fetch gallery images
  }

  const filterUsers = () => {
    let filtered = users
    if (streamFilter) {
      filtered = filtered.filter((user) => user.stream === streamFilter)
    }
    if (sessionFilter) {
      filtered = filtered.filter((user) => user.session === sessionFilter)
    }
    setFilteredUsers(filtered)
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await fetch(`/api/users/${userId}`, { method: "DELETE" })
      setUsers(users.filter((user) => user.id !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    }
  }

  const handleAddHighlight = async () => {
    // Implement API call to add new highlight
  }

  const handleAddGalleryImage = async () => {
    // Implement API call to add new gallery image
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 p-8"
    >
      <h1 className="text-4xl font-bold text-indigo-600 mb-8">Dashboard</h1>

      {/* User Management Section */}
      <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Management</h2>
        <div className="flex mb-4 space-x-4">
          <select value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)} className="p-2 border rounded">
            <option value="">All Streams</option>
            <option value="BCA">BCA</option>
            <option value="BCom">BCom</option>
            <option value="BSc">BSc</option>
            <option value="BBA">BBA</option>
            <option value="MSc(cs)">MSc (CS)</option>
            <option value="MSc(maths)">MSc (Maths)</option>
            <option value="BA">BA</option>
          </select>
          <input
            type="text"
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            placeholder="Filter by session"
            className="p-2 border rounded"
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Stream</th>
              <th className="p-2 text-left">Session</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.stream}</td>
                <td className="p-2">{user.session}</td>
                <td className="p-2">
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Highlights Section */}
      <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {highlights.map((highlight) => (
            <div key={highlight.id} className="border p-4 rounded">
              <h3 className="font-semibold">{highlight.title}</h3>
              <a href={highlight.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                YouTube Link
              </a>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddHighlight} className="flex space-x-2">
          <input
            type="text"
            value={newHighlight.title}
            onChange={(e) => setNewHighlight({ ...newHighlight, title: e.target.value })}
            placeholder="Highlight Title"
            className="flex-grow p-2 border rounded"
          />
          <input
            type="text"
            value={newHighlight.youtubeLink}
            onChange={(e) => setNewHighlight({ ...newHighlight, youtubeLink: e.target.value })}
            placeholder="YouTube Link"
            className="flex-grow p-2 border rounded"
          />
          <button type="submit" className="bg-indigo-600 text-white p-2 rounded">
            <Plus size={18} />
          </button>
        </form>
      </section>

      {/* Gallery Section */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {galleryImages.map((image) => (
            <div key={image.id} className="relative aspect-square">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            </div>
          ))}
        </div>
        <form onSubmit={handleAddGalleryImage} className="flex space-x-2">
          <input
            type="file"
            onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
            className="flex-grow p-2 border rounded"
          />
          <input
            type="text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Image Description"
            className="flex-grow p-2 border rounded"
          />
          <button type="submit" className="bg-indigo-600 text-white p-2 rounded">
            <Upload size={18} />
          </button>
        </form>
      </section>
    </motion.div>
  )
}

