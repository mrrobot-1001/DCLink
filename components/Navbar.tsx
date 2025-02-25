"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X, PlusSquare, LogOut, BarChart2 } from "lucide-react"
import { motion } from "framer-motion"
import UserProfileDialog from "./UserProfileDialog"
import Logo from "next/image"

type NavbarProps = {
  onPostClick: () => void
}

type User = {
  name: string
  avatar: string | null
  email: string
  bio: string
  location: string
  website: string
  joinDate: string
  followers: number
  following: number
}

export default function Navbar({ onPostClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setIsLoading(false)
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
          setIsLoading(false)
          return
        }

        const user: User = await response.json()
        setCurrentUser(user)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleDashboardClick = () => {
    const password = prompt("Enter the dashboard password:")
    if (password === "DC@)@$") {
      router.push("/dashboard")
    } else {
      alert("Incorrect password")
    }
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Logo src="/images/linkimg.jpg" alt="DCLink Logo" width={60} height={80} className="mr-2" />
              <span className="text-2xl font-bold text-indigo-600">DCLink</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
          <Link
              href="/gallery"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Gallery
            </Link>
           
            <Link
              href="/about"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              About
            </Link>
            <button
              onClick={onPostClick}
              className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 flex items-center"
            >
              <PlusSquare className="inline-block mr-1" size={18} /> Post
            </button>
            <button
              onClick={handleDashboardClick}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <BarChart2 className="inline-block mr-1" size={18} /> Dashboard
            </button>
            {isLoading ? (
              <span className="ml-3 text-gray-500">Loading...</span>
            ) : currentUser ? (
              <>
                <motion.button
                  onClick={handleProfileClick}
                  className="ml-3 flex items-center bg-indigo-100 rounded-full p-1 hover:bg-indigo-200 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={currentUser.avatar || "/a1.svg"}
                    alt={currentUser.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="ml-2 text-sm font-medium text-indigo-800 mr-2">{currentUser.name}</span>
                </motion.button>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-500 flex items-center"
                >
                  <LogOut size={18} className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="ml-3 px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Login
              </Link>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              About
            </Link>
            <Link
              href="/feedback"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Feedback
            </Link>
            <button
              onClick={onPostClick}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 flex items-center"
            >
              <PlusSquare className="inline-block mr-1" size={18} /> Post
            </button>
            <button
              onClick={handleDashboardClick}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <BarChart2 className="inline-block mr-1" size={18} /> Dashboard
            </button>
            {currentUser && (
              <>
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50 flex items-center"
                >
                  <LogOut size={18} className="mr-1" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {currentUser && (
        <UserProfileDialog isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={currentUser} />
      )}
    </nav>
  )
}

