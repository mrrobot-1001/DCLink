import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Users, UserCheck } from "lucide-react";
import ProfileDialog from "./ProfileDialog";

type User = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  isConnected: boolean; // Indicates whether the user is connected
};

export default function ConnectionSection() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showConnected, setShowConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  // Fetch the logged-in user ID (replace with your auth mechanism)
  const fetchLoggedInUserId = async () => {
    try {
      const response = await fetch("/pages/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logged-in user ID");
      }

      const data = await response.json();
      setLoggedInUserId(data.id); // Assuming the API returns the logged-in user's ID
    } catch (error) {
      console.error("Error fetching logged-in user ID:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your token mechanism
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: User[] = await response.json();
      setUsers(
        data.map((user) => ({
          ...user,
          isConnected: user.followers.some(
            (follower) => follower.followerId === loggedInUserId, // Dynamically use the logged-in user's ID
          ),
        })),
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
      fetchUsers();
    }
  }, [loggedInUserId]);

  const handleFollow = async (userId: number) => {
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your token mechanism
        },
        body: JSON.stringify({ followingId: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to follow user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isConnected: true } : user,
        ),
      );
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId: number) => {
    try {
      const response = await fetch("/api/unfollow", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your token mechanism
        },
        body: JSON.stringify({ followingId: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to unfollow user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isConnected: false } : user,
        ),
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.id !== loggedInUserId && // Exclude the logged-in user
      (showConnected ? user.isConnected : true) &&
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
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
                src="/a1.svg" // Replace with actual user avatar
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
