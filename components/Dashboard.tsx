"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ContentSection from "./ContentSection"
import Carousel from "./Carousel"
import HighlightForm from "./HighlightForm"
import CarouselForm from "./CarouselForm"

type User = {
  id: number
  username: string
  email: string
  session: string
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [sessionFilter, setSessionFilter] = useState("")
  const [refreshHighlights, setRefreshHighlights] = useState(false)
  const [refreshCarousel, setRefreshCarousel] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const url = sessionFilter ? `/api/userdash?session=${encodeURIComponent(sessionFilter)}` : "/api/userdash"
      const response = await fetch(url)
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/userdash/${userId}`, { method: "DELETE" })
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId))
        toast.success("User deleted successfully")
      } else {
        throw new Error("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    }
  }

  const handleHighlightAdded = () => {
    setRefreshHighlights((prev) => !prev)
  }

  const handleCarouselItemAdded = () => {
    setRefreshCarousel((prev) => !prev)
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
          <Input
            type="text"
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            placeholder="Filter by session"
            className="p-2 border rounded"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Session</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.session}</td>
                  <td className="p-2">
                    <Button onClick={() => handleDeleteUser(user.id)} variant="destructive" size="sm">
                      <Trash2 size={18} />
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
    </motion.div>
  )
}

