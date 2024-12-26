"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Users, UserCheck } from 'lucide-react';
import ProfileDialog from "./ProfileDialog";

type User = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  isConnected: boolean;
};

export default function ConnectionSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConnected, setShowConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the logged-in user's ID
  const fetchLoggedInUserId = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/auth/profile?t=${timestamp}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logged-in user ID");
      }

      const data = await response.json();
      setLoggedInUserId(data.id);
    } catch (error) {
      console.error("Error fetching logged-in user ID:", error);
      setError("Failed to fetch user profile. Please try again.");
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/users?t=${timestamp}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoggedInUserId();
  }, []);

  useEffect(() => {
    if (loggedInUserId !== null) {
      fetchUsers();
    }
  }, [loggedInUserId]);

  const handleConnect = async (userId: number) => {
    try {
      const response = await fetch("/api/connection/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ connectedTo: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isConnected: true } : user
        )
      );
    } catch (error) {
      console.error("Error connecting to user:", error);
      setError("Failed to connect to user. Please try again.");
    }
  };

  const handleDisconnect = async (userId: number) => {
    try {
      const response = await fetch("/api/connection/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ connectedTo: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect from user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isConnected: false } : user
        )
      );
    } catch (error) {
      console.error("Error disconnecting from user:", error);
      setError("Failed to disconnect from user. Please try again.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.id !== loggedInUserId &&
      (showConnected ? user.isConnected : true) &&
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

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
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center">
                <Image
                  src="/a1.svg"
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
                    {user.bio || "No bio available"}
                  </p>
                </div>
                {user.isConnected ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDisconnect(user.id);
                    }}
                    className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnect(user.id);
                    }}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {showConnected ? "No connected users found." : "No users found."}
          </div>
        )}
      </div>
      {selectedUser && (
        <ProfileDialog
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
        />
      )}
    </div>
  );
}

