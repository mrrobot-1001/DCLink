"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, LinkIcon, Calendar, Mail } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

type User = {
  id: number;
  name: string;
  avatar: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  followers: number;
  following: number;
};

type UserProfileDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserProfileDialog({
  isOpen,
  onClose,
}: UserProfileDialogProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(
            `Failed to fetch user details. Server responded with: ${message}`,
          );
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(
          err instanceof Error ? err.message : "Unexpected error occurred.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserDetails();
    }
  }, [isOpen]);

  const handleClose = () => {
    setUser(null); // Clear user data on close
    setError(null); // Clear error on close
    onClose();
  };

  if (loading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="text-white text-lg">Loading user data...</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (error) {
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
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center"
            >
              <h3 className="text-lg font-semibold text-red-500">Error</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
              <button
                onClick={handleClose}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (!user) {
    return null; // Avoid rendering anything if there's no user or error
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
                onClick={handleClose}
                aria-label="Close"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col items-center">
                <Image
                  src={"/a1.svg"}
                  alt={`${user.name}'s avatar`}
                  width={100}
                  height={100}
                  className="rounded-full mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <p className="text-center mb-4 text-gray-600 dark:text-gray-400">
                  {user.bio}
                </p>
                <div className="flex space-x-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold">{user.followers}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{user.following}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Following
                    </div>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail size={16} className="mr-2" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin size={16} className="mr-2" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center">
                    <LinkIcon
                      size={16}
                      className="mr-2 text-gray-600 dark:text-gray-400"
                    />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar size={16} className="mr-2" />
                    <span>Joined {user.joinDate}</span>
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
