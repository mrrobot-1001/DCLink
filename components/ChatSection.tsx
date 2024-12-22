"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ChatDialog from "./ChatDialog";
import { MessageSquare } from "lucide-react";

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  isConnected: boolean;
};

export default function ChatSection() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    // Simulating API call to fetch chats
    const fetchChats = async () => {
      // In a real application, this would be an API call
      const mockChats: Chat[] = [
        {
          id: 1,
          name: "John Doe",
          avatar: "/a1.svg",
          lastMessage: "Hey, how are you?",
          isConnected: true,
        },
        {
          id: 2,
          name: "Jane Smith",
          avatar: "/a2.svg",
          lastMessage: "Did you see the latest post?",
          isConnected: true,
        },
        {
          id: 3,
          name: "Bob Johnson",
          avatar: "/a3.svg",
          lastMessage: "Let's catch up soon!",
          isConnected: false,
        },
        {
          id: 4,
          name: "Alice Williams",
          avatar: "/a4.svg",
          lastMessage: "Thanks for your help!",
          isConnected: true,
        },
      ];
      setChats(mockChats);
    };

    fetchChats();
  }, []);

  const connectedChats = chats.filter((chat) => chat.isConnected);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg text-black font-semibold">Chats</h2>
      </div>
      {connectedChats.length > 0 ? (
        <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto">
          {connectedChats.map((chat) => (
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
                  <p className="text-sm font-medium text-gray-900">
                    {chat.name}
                  </p>
                  <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-2 text-gray-400" />
          <p>No connected chats available.</p>
          <p className="text-sm">Connect with people to start chatting!</p>
        </div>
      )}
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
