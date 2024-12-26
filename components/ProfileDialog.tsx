"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, LinkIcon, Calendar } from "lucide-react";
import Image from "next/image";

type ProfileDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    username: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
    joinDate: string;
    followers: number;
    following: number;
  };
};

export default function ProfileDialog({ isOpen, onClose, user }: ProfileDialogProps) {
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
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center">
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt={user.username}
                width={80}
                height={80}
                className="rounded-full"
              />
              <h2 className="text-2xl font-bold mt-4">{user.username}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
              <div className="mt-4 flex items-center text-gray-600 dark:text-gray-400">
                <MapPin size={16} className="mr-2" />
                <span>{user.location}</span>
              </div>
              <div className="mt-2">
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {user.website || "No website available."}
                </a>
              </div>
              <div className="mt-4 flex items-center text-gray-600 dark:text-gray-400">
                <Calendar size={16} className="mr-2" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="mt-4 flex space-x-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">{user.followers}</p>
                  <p className="text-gray-600 dark:text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{user.following}</p>
                  <p className="text-gray-600 dark:text-gray-400">Following</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
