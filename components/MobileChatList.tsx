"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import ChatDialog from "./ChatDialog"

type Chat = {
  id: number
  users: {
    id: number
    username: string
    avatar: string
  }[]
  lastMessage: string
  unreadCount: number
}

type MobileChatListProps = {
  isOpen: boolean
  onClose: () => void
}

export default function MobileChatList({ isOpen, onClose }: MobileChatListProps) {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("/api/chats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch chats")
        }

        const data = await response.json()
        setChats(data)
      } catch (error) {
        console.error("Error fetching chats:", error)
      }
    }

    if (isOpen) {
      fetchChats()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const otherUser = chat.users[0]
          return (
            <div
              key={chat.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex items-center">
                <Image
                  src={otherUser.avatar || "/placeholder.svg?height=50&width=50"}
                  alt={otherUser.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{otherUser.username}</p>
                  <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {selectedChat && (
        <ChatDialog
          isOpen={true}
          onClose={() => setSelectedChat(null)}
          chat={chats.find((chat) => chat.id === selectedChat)!}
          loggedInUserId={1} // Replace with actual logged-in user ID
          onChatUpdate={(updatedChat) => {
            setChats((prevChats) => prevChats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)))
          }}
          socket={null} // Replace with actual socket instance if using real-time updates
        />
      )}
    </div>
  )
}

