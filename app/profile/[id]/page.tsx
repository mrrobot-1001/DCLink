'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, LinkIcon, Calendar, Mail, Users, Instagram, GitlabIcon as GitHub, Linkedin, Briefcase, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

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
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      try {
        const response = await fetch(`/api/users/${params.id}`, {
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

        const userData: User = await response.json()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router, params.id])

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
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-indigo-600">
          <h3 className="text-lg leading-6 font-medium text-white">User Profile</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col items-center">
            <Image
              src="/a1.svg"
              alt={`${user.username}'s avatar`}
              width={100}
              height={100}
              className="rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.username}</h2>
            <p className="text-center mb-4 text-gray-600">{user.bio || "No bio available."}</p>
          </div>
          <div className="mt-5 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-gray-400" />
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-gray-400" />
                  Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.location || "Not specified"}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <LinkIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Website
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.website ? (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                      {user.website}
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-gray-400" />
                  Connections
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.connections.length}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                  Joined
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(user.joinDate).toLocaleDateString()}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Instagram className="mr-2 h-5 w-5 text-gray-400" />
                  Instagram
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.instagramProfile ? (
                    <a href={user.instagramProfile} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                      {user.instagramProfile}
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <GitHub className="mr-2 h-5 w-5 text-gray-400" />
                  GitHub
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.githubProfile ? (
                    <a href={user.githubProfile} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                      {user.githubProfile}
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Linkedin className="mr-2 h-5 w-5 text-gray-400" />
                  LinkedIn
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.linkedinProfile ? (
                    <a href={user.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                      {user.linkedinProfile}
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-gray-400" />
                  Skills
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.skills || "Not specified"}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-gray-400" />
                  Currently Working At
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.currentlyWorkingAt || "Not specified"}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-gray-400" />
                  Past Work Experience
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.pastWorkedAt || "Not specified"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

