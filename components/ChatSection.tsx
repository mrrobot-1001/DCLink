"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import ChatDialog from "./ChatDialog"
import { MessageSquare, Trash2 } from "lucide-react"
import io from "socket.io-client"

type User = {
  id: number
  username: string
  avatar: string
}

type Chat = {
  id: number
  users: User[]
  lastMessage: string
  unreadCount: number
}

export default function ChatSection() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null)
  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    const newSocket = io("http://localhost:3000")
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user profile")
        }

        const data = await response.json()
        setLoggedInUserId(data.id)
      } catch (error) {
        console.error("Error fetching logged-in user ID:", error)
        setError("Failed to fetch user profile. Please try again.")
      }
    }

    fetchLoggedInUserId()
  }, [])

  const fetchChats = async () => {
    if (!loggedInUserId) return

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("/api/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to fetch chats: ${errorData.error}`)
      }

      const data: Chat[] = await response.json()
      console.log("Fetched chats:", data)
      setChats(data)
    } catch (err) {
      console.error("Error fetching chats:", err)
      setError(err instanceof Error ? err.message : "Unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loggedInUserId) {
      fetchChats()
    }
  }, [loggedInUserId])

  useEffect(() => {
    if (socket) {
      socket.on("chat updated", (updatedChat: Chat) => {
        setChats((prevChats) => prevChats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)))
      })

      socket.on("chat deleted", (deletedChatId: number) => {
        setChats((prevChats) => prevChats.filter((chat) => chat.id !== deletedChatId))
      })

      socket.on("new connection", () => {
        fetchChats()
      })
    }

    return () => {
      if (socket) {
        socket.off("chat updated")
        socket.off("chat deleted")
        socket.off("new connection")
      }
    }
  }, [socket])

  const handleChatUpdate = (updatedChat: Chat) => {
    setChats((prevChats) => prevChats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)))
  }

  const handleDeleteChat = async (chatId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete chat")
      }

      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId))
    } catch (error) {
      console.error("Error deleting chat:", error)
      setError("Failed to delete chat. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Loading chats...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-indigo-100">
      <div className="p-4 border-b border-indigo-100">
        <h2 className="text-lg text-indigo-800 font-semibold">Chats</h2>
      </div>
      {chats.length > 0 && loggedInUserId ? (
        <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto">
          {chats.map((chat) => {
            const otherUser = chat.users.find((user) => user.id !== loggedInUserId)
            if (!otherUser) return null

            return (
              <div
                key={chat.id}
                className="p-4 hover:bg-indigo-50 cursor-pointer transition duration-150 ease-in-out flex justify-between items-center border-b border-indigo-100 last:border-b-0"
              >
                <div className="flex items-center flex-grow" onClick={() => setSelectedChat(chat.id)}>
                  <Image
                    src={otherUser.avatar || "/a1.svg"}
                    alt={otherUser.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{otherUser.username}</p>
                    <p className="text-sm text-gray-500">{chat.lastMessage || "No messages yet"}</p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="ml-auto bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteChat(chat.id)}
                  className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-4 text-center text-indigo-500">
          <MessageSquare size={48} className="mx-auto mb-2 text-indigo-400" />
          <p>No chats with connected users.</p>
          <p className="text-sm">Connect with people to start chatting!</p>
        </div>
      )}
      {selectedChat && loggedInUserId && (
        <ChatDialog
          isOpen={true}
          onClose={() => setSelectedChat(null)}
          chat={chats.find((chat) => chat.id === selectedChat)!}
          loggedInUserId={loggedInUserId}
          onChatUpdate={handleChatUpdate}
          socket={socket}
        />
      )}
    </div>
  )
}

