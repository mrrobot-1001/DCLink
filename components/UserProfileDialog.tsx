"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, LinkIcon, Calendar, Mail } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, Users, UserCheck } from "lucide-react";
import ProfileDialog from "./ProfileDialog";

type User = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
<<<<<<< HEAD
  followers?: { followerId: number }[]; // Followers relationship
  following?: { followingId: number }[]; // Following relationship
  isConnected: boolean; // Indicates whether the logged-in user is connected
=======
>>>>>>> 0447a8f3363544cfe7947480e0d1a8819e94e7c7
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

        // Fetch user profile from /auth/profile endpoint
        const response = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(
            `Failed to fetch user details. Server responded with: ${message}`
          );
        }

        const data: User = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(
          err instanceof Error ? err.message : "Unexpected error occurred."
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
                  src={"/a1.svg"} // Replace with dynamic avatar if available
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

export function ConnectionSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showConnected, setShowConnected] = useState(false);

  // Fetch the logged-in user's ID
  const fetchLoggedInUserId = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logged-in user ID");
      }

      const data = await response.json();
      setLoggedInUserId(data.id); // Assuming the API returns the user's ID
    } catch (error) {
      console.error("Error fetching logged-in user ID:", error);
    }
  };

  // Fetch all users
  const fetchUsers = async (userId: number) => {
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: User[] = await response.json();
      setUsers(
        data.map((user) => ({
          ...user,
          isConnected: user.followers?.some(
            (follower) => follower.followerId === userId
          ),
        }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchLoggedInUserId();
  }, []);

  useEffect(() => {
    if (loggedInUserId !== null) {
      fetchUsers(loggedInUserId);
    }
  }, [loggedInUserId]);

  const handleFollow = async (userId: number) => {
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ followingId: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to follow user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isConnected: true } : user
        )
      );
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId: number) => {
    try {
      const response = await fetch("/api/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ followingId: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to unfollow user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isConnected: false } : user
        )
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.id !== loggedInUserId &&
      (showConnected ? user.isConnected : true) &&
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg text-black font-semibold mb-2">Connections</h2>
        <div className="flex items-center mb-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <button
            className={`ml-2 px-4 py-2 rounded-lg flex items-center ${
              showConnected
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setShowConnected(!showConnected)}
          >
            {showConnected ? (
              <UserCheck size={20} className="mr-2" />
            ) : (
              <Users size={20} className="mr-2" />
            )}
            {showConnected ? "Connected" : "All Users"}
          </button>
        </div>
      </div>
      <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
          >
            <div className="flex items-center">
              <Image
                src="/a1.svg" // Replace with dynamic avatar if available
                alt={user.username}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-3 flex-grow">
                <p className="text-sm font-medium text-gray-900">
                  {user.username}
                </p>
                <p className="text-sm text-gray-500">
                  {user.bio || "User Bio"}
                </p>
              </div>
              {user.isConnected ? (
                <button
                  onClick={() => handleUnfollow(user.id)}
                  className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(user.id)}
                  className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedUser && (
        <ProfileDialog
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          user={users.find((user) => user.id === selectedUser)!}
        />
      )}
    </div>
  );
}
