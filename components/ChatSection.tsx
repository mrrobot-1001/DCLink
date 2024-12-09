"use client";

import { useState } from "react";
import Image from "next/image";
import ChatDialog from "./ChatDialog";

export default function ChatSection() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const chats = [
    {
      id: 1,
      name: "John Doe",
      avatar: "/a1.svg",
      lastMessage: "Hey, how are you?",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "/a2.svg",
      lastMessage: "Did you see the latest post?",
    },
    {
      id: 3,
      name: "Bob Johnson",
      avatar: "/a3.svg",
      lastMessage: "Let's catch up soon!",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg text-black font-semibold">Chats</h2>
      </div>
      <div className="divide-y">
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
