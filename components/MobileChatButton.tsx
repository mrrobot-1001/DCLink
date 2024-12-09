"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import MobileChatList from "./MobileChatList";

export default function MobileChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition duration-150 ease-in-out"
      >
        <MessageCircle size={24} />
      </button>
      <MobileChatList isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
