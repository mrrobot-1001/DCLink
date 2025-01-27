"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  MapPin,
  LinkIcon,
  Calendar,
  Mail,
  Users,
  Instagram,
  GitlabIcon as GitHub,
  Linkedin,
  Briefcase,
  BookOpen,
  Edit,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"

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
  joinDate: string
  connections: { id: number }[]
  session?: string
  isAdmin: boolean
  profilePicture?: string
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<User>>({})
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/")
        return
      }

      try {
        const response = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token")
            router.push("/")
          }
          return
        }

        const userData: User = await response.json()
        setUser(userData)
        setEditedUser(userData)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/")
        return
      }

      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile")
    }
  }

  const handleCancel = () => {
    setEditedUser(user || {})
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedUser((prev) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">User not found</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center">
          <h3 className="text-2xl leading-6 font-semibold text-white">User Profile</h3>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md transition duration-300 ease-in-out"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col items-center mb-8">
            {user.profilePicture ? (
              <Image
                src={user.profilePicture || "/placeholder.svg"}
                alt={`${user.username}'s avatar`}
                width={120}
                height={120}
                className="rounded-full mb-4 border-4 border-indigo-200"
              />
            ) : (
              <Image
                src="/a1.svg"
                alt={`${user.username}'s avatar`}
                width={120}
                height={120}
                className="rounded-full mb-4 border-4 border-indigo-200"
              />
            )}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h2>
            {user.isAdmin && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                Admin
              </span>
            )}
            {isEditing ? (
              <textarea
                name="bio"
                value={editedUser.bio || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your bio"
                rows={3}
              />
            ) : (
              <p className="text-center mb-4 text-gray-600 max-w-lg">{user.bio || "No bio available."}</p>
            )}
          </div>
          <div className="mt-5 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              {[
                { icon: Mail, label: "Email", field: "email" },
                { icon: MapPin, label: "Location", field: "location" },
                { icon: LinkIcon, label: "Website", field: "website" },
                { icon: Instagram, label: "Instagram", field: "instagramProfile" },
                { icon: GitHub, label: "GitHub", field: "githubProfile" },
                { icon: Linkedin, label: "LinkedIn", field: "linkedinProfile" },
                { icon: BookOpen, label: "Skills", field: "skills" },
                { icon: Briefcase, label: "Currently Working At", field: "currentlyWorkingAt" },
                { icon: Briefcase, label: "Past Work Experience", field: "pastWorkedAt" },
                { icon: Calendar, label: "Session", field: "session" },
              ].map(({ icon: Icon, label, field }) => (
                <div key={field} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Icon className="mr-2 h-5 w-5 text-indigo-500" />
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                      field === "skills" || field === "pastWorkedAt" ? (
                        <textarea
                          name={field}
                          value={editedUser[field as keyof User] || ""}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          rows={3}
                        />
                      ) : (
                        <input
                          type="text"
                          name={field}
                          value={editedUser[field as keyof User] || ""}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      )
                    ) : (
                      <span className="bg-gray-100 px-3 py-2 rounded-md">
                        {user[field as keyof User] || "Not specified"}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-indigo-500" />
                  Connections
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-md">{user.connections.length}</span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                  Joined
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="bg-green-100 text-green-800 px-3 py-2 rounded-md">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

