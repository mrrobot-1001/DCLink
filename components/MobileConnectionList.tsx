"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import ProfileDialog from "./ProfileDialog"

type User = {
  id: number
  username: string
  avatar: string
  role: string
}

type MobileConnectionListProps = {
  isOpen: boolean
  onClose: () => void
}

export default function MobileConnectionList({ isOpen, onClose }: MobileConnectionListProps) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [connections, setConnections] = useState<User[]>([])

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch("/api/connections", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch connections")
        }

        const data = await response.json()
        setConnections(data)
      } catch (error) {
        console.error("Error fetching connections:", error)
      }
    }

    if (isOpen) {
      fetchConnections()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Connections</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
            onClick={() => setSelectedUser(connection.id)}
          >
            <div className="flex items-center">
              <Image
                src={connection.avatar || "/placeholder.svg?height=50&width=50"}
                alt={connection.username}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{connection.username}</p>
                <p className="text-sm text-gray-500">{connection.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedUser && (
        <ProfileDialog
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          user={connections.find((user) => user.id === selectedUser)!}
        />
      )}
    </div>
  )
}

