"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import MobileConnectionList from "./MobileConnectionList";

export default function MobileConnectionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition duration-150 ease-in-out"
      >
        <Users size={24} />
      </button>
      <MobileConnectionList isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
