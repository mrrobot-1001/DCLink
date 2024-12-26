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
};

export default function ChatSection() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Fetch the token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Fetch chats whenever the token changes
  useEffect(() => {
    if (!token) return; // Wait until the token is available

    const fetchChats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/chats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chats.");
        }

        const data: Chat[] = await response.json();
        setChats(data);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError(
          err instanceof Error ? err.message : "Unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token]); // Re-run when the token changes

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Loading chats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg text-black font-semibold">Chats</h2>
      </div>
      {chats.length > 0 ? (
        <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto">
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
