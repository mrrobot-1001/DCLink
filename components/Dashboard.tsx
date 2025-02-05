"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import ContentSection from "./ContentSection"
import Carousel from "./Carousel"
import HighlightForm from "./HighlightForm"
import CarouselForm from "./CarouselForm"
import GalleryForm from "./GalleryForm"

type User = {
  id: number
  username: string
  email: string
  bio?: string
  location?: string
  website?: string
  instagramProfile?: string
  githubProfile?: string
  linkedinProfile?: string
  skills?: string
  currentlyWorkingAt?: string
  pastWorkedAt?: string
  session?: string
  isAdmin: boolean
  joinDate: string
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [sessionFilter, setSessionFilter] = useState("")
  const [sessions, setSessions] = useState<string[]>([])
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [refreshHighlights, setRefreshHighlights] = useState(false)
  const [refreshCarousel, setRefreshCarousel] = useState(false)
  const [refreshGallery, setRefreshGallery] = useState(false)

  useEffect(() => {
    fetchCurrentUser()
    fetchSessions()
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [sessionFilter])

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const user = await response.json()
        setCurrentUserId(user.id)
      }
    } catch (error) {
      console.error("Error fetching current user:", error)
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions")
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error("Error fetching sessions:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const url = sessionFilter ? `/api/userdash?session=${encodeURIComponent(sessionFilter)}` : "/api/userdash"
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.filter((user) => user.id !== currentUserId))
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/userdash/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }

      // Remove the deleted user from the state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete user")
    }
  }

  const handleHighlightAdded = () => {
    setRefreshHighlights((prev) => !prev)
  }

  const handleCarouselItemAdded = () => {
    setRefreshCarousel((prev) => !prev)
  }

  const handleEventAdded = () => {
    setRefreshGallery((prev) => !prev)
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
        <div className="mb-4">
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">All Sessions</option>
            {sessions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Session</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Current Work</th>
                <th className="p-2 text-left">Skills</th>
                <th className="p-2 text-left">Join Date</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.session || "N/A"}</td>
                  <td className="p-2">{user.location || "N/A"}</td>
                  <td className="p-2">{user.currentlyWorkingAt || "N/A"}</td>
                  <td className="p-2">{user.skills || "N/A"}</td>
                  <td className="p-2">{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td className="p-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Current Highlights</h3>
            <ContentSection key={refreshHighlights ? "refresh" : "normal"} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Add New Highlight</h3>
            <HighlightForm onHighlightAdded={handleHighlightAdded} />
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Carousel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Current Carousel</h3>
            <Carousel key={refreshCarousel ? "refresh" : "normal"} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Add New Carousel Item</h3>
            <CarouselForm onCarouselItemAdded={handleCarouselItemAdded} />
          </div>
        </div>
      </section>

      {/* Gallery Management Section */}
      <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gallery Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Add New Event</h3>
            <GalleryForm onEventAdded={handleEventAdded} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Current Events</h3>
            {/* You can add a list or grid of current events here */}
          </div>
        </div>
      </section>
    </motion.div>
  )
}

