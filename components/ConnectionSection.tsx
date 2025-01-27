"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Users, UserCheck } from "lucide-react"
import ProfileDialog from "./ProfileDialog"
import useSocket from "../hooks/useSocket"
import type { User } from "../types/user"

export default function ConnectionSection() {
  const [users, setUsers] = useState<User[]>([])
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showConnected, setShowConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isConnected, emit, on, off } = useSocket()

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!response.ok) throw new Error("Failed to fetch profile")
        const data = await response.json()
        setLoggedInUser(data)
        if (isConnected) {
          emit("join-user", data.id)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to fetch user profile")
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!response.ok) throw new Error("Failed to fetch users")
        const data: User[] = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to fetch users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoggedInUser()
    fetchUsers()

    on("connection-established", ({ connection, chat }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === connection.connectedTo ? { ...user, isConnected: true } : user)),
      )
      // Notify ChatSection about the new chat
      emit("new-chat", chat)
    })

    on("connection-removed", ({ connection }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === connection.connectedTo ? { ...user, isConnected: false } : user)),
      )
    })

    return () => {
      off("connection-established")
      off("connection-removed")
    }
  }, [emit, on, off, isConnected])

  const handleConnect = async (userId: number) => {
    if (!loggedInUser) return
    try {
      const response = await fetch("/api/connections/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) throw new Error("Failed to connect")
      const data = await response.json()
      emit("new-connection", { connection: data.connection, chat: data.chat })
    } catch (error) {
      console.error("Error connecting:", error)
      setError("Failed to connect")
    }
  }

  const handleDisconnect = async (userId: number) => {
    if (!loggedInUser) return
    try {
      const response = await fetch("/api/connections/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to disconnect")
      }
      emit("remove-connection", { userId: loggedInUser.id, connectedTo: userId })
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, isConnected: false } : user)))
    } catch (error) {
      console.error("Error disconnecting:", error)
      setError(error instanceof Error ? error.message : "Failed to disconnect")
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.id !== loggedInUser?.id &&
      (showConnected ? user.isConnected : true) &&
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) return <div className="p-4 text-center">Loading...</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-indigo-100">
      <div className="p-4 border-b border-indigo-100">
        <h2 className="text-lg text-indigo-800 font-semibold mb-2">Connections</h2>
        <div className="flex items-center mb-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button
            className={`ml-2 px-4 py-2 rounded-lg flex items-center ${
              showConnected ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setShowConnected(!showConnected)}
          >
            {showConnected ? <UserCheck size={20} className="mr-2" /> : <Users size={20} className="mr-2" />}
            {showConnected ? "Connected" : "All Users"}
          </button>
        </div>
      </div>
      <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 hover:bg-indigo-50 cursor-pointer transition duration-150 ease-in-out border-b border-indigo-100 last:border-b-0"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center">
                <Image
                  src={user.avatar || "/a1.svg"}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.bio || "No bio available"}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    user.isConnected ? handleDisconnect(user.id) : handleConnect(user.id)
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                    user.isConnected
                      ? "bg-red-100 text-red-800 hover:bg-red-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {user.isConnected ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {showConnected ? "No connected users found." : "No users found."}
          </div>
        )}
      </div>
      {selectedUser && <ProfileDialog isOpen={true} onClose={() => setSelectedUser(null)} user={selectedUser} />}
    </div>
  )
}

