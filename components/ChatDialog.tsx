"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send } from "lucide-react";

type Message = {
  id: number;
  sender: "user" | "other";
  content: string;
  timestamp: string;
};

type ChatDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  chat: {
    id: number;
    name: string;
    avatar: string;
  };
};

export default function ChatDialog({ isOpen, onClose, chat }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "other",
      content: "Hey, how are you?",
      timestamp: "10:00 AM",
    },
    {
      id: 2,
      sender: "user",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:05 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "user",
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <Image
              src={chat.avatar}
              alt={chat.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="ml-3 text-black font-semibold">{chat.name}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="h-96 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg p-3 max-w-xs ${
                  message.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-75">{message.timestamp}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
