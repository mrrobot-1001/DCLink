"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, LinkIcon, Calendar, Mail, Users } from 'lucide-react';
import Image from "next/image";
import { useState, useEffect } from "react";

type User = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
  connections: { id: number }[];
};

type ProfileDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
};

export default function ProfileDialog({
  isOpen,
  onClose,
  user,
}: ProfileDialogProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <div className="relative p-6">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col items-center">
                <Image
                  src="/a1.svg"
                  alt={`${user.username}'s avatar`}
                  width={100}
                  height={100}
                  className="rounded-full mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
                <p className="text-center mb-4 text-gray-600 dark:text-gray-400">
                  {user.bio || "No bio available."}
                </p>
                <div className="w-full space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail size={16} className="mr-2" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin size={16} className="mr-2" />
                    <span>{user.location || "Location not provided."}</span>
                  </div>
                  <div className="flex items-center">
                    <LinkIcon
                      size={16}
                      className="mr-2 text-gray-600 dark:text-gray-400"
                    />
                    <a
                      href={user.website || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {user.website || "No website available."}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mt-2">
                    <Users size={16} className="mr-2" />
                    <span>{user.connections.length} Connections</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar size={16} className="mr-2" />
                    <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

