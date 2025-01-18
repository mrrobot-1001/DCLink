'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Trash2, Plus, Youtube } from 'lucide-react'
import Image from 'next/image'

type User = {
  id: number
  username: string
  email: string
}

type Highlight = {
  id: number
  title: string
  image: string
  youtubeLink: string
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [newHighlight, setNewHighlight] = useState({ title: "", youtubeLink: "" })

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      try {
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token')
            router.push('/')
          }
          return
        }

        const userData: User[] = await response.json()
        setUsers(userData)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [router])

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/')
          return
        }

        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to delete user')
        }

        setUsers(users.filter(user => user.id !== userId))
        toast.success('User deleted successfully')
      } catch (error) {
        console.error('Failed to delete user:', error)
        toast.error('Failed to delete user')
      }
    }
  }

  const addHighlight = () => {
    if (newHighlight.title && newHighlight.youtubeLink) {
      const videoId = new URL(newHighlight.youtubeLink).searchParams.get("v")
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`
      setHighlights([
        ...highlights,
        {
          id: highlights.length + 1,
          title: newHighlight.title,
          image: thumbnailUrl,
          youtubeLink: newHighlight.youtubeLink,
        },
      ])
      setNewHighlight({ title: "", youtubeLink: "" })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Total Users: {users.length}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Highlights</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Add New Highlight</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={newHighlight.title}
                  onChange={(e) =>
                    setNewHighlight({ ...newHighlight, title: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="YouTube Link"
                  value={newHighlight.youtubeLink}
                  onChange={(e) =>
                    setNewHighlight({ ...newHighlight, youtubeLink: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addHighlight}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add
                </button>
              </div>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {highlights.map((highlight) => (
                <motion.div
                  key={highlight.id}
                  className="flex-shrink-0 w-48"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href={highlight.youtubeLink} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="relative">
                      <Image
                        src={highlight.image || "/placeholder.svg"}
                        alt={highlight.title}
                        width={200}
                        height={100}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                        <Youtube className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {highlight.title}
                    </p>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

