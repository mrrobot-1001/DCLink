"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import ChatDialog from "./ChatDialog";

type MobileChatListProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileChatList({
  isOpen,
  onClose,
}: MobileChatListProps) {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const chats = [
    {
      id: 1,
      name: "John Doe",
      avatar: "/placeholder.svg?height=50&width=50",
      lastMessage: "Hey, how are you?",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=50&width=50",
      lastMessage: "Did you see the latest post?",
    },
    {
      id: 3,
      name: "Bob Johnson",
      avatar: "/placeholder.svg?height=50&width=50",
      lastMessage: "Let's catch up soon!",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
            onClick={() => setSelectedChat(chat.id)}
          >
            <div className="flex items-center">
              <Image
                src={chat.avatar}
                alt={chat.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{chat.name}</p>
                <p className="text-sm text-gray-500">{chat.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedChat && (
        <ChatDialog
          isOpen={true}
          onClose={() => setSelectedChat(null)}
          chat={chats.find((chat) => chat.id === selectedChat)!}
        />
      )}
    </div>
  );
}
