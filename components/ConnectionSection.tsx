"use client";

import { useState } from "react";
import Image from "next/image";
import ProfileDialog from "./ProfileDialog";

export default function ConnectionSection() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const connections = [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: "/a6.svg",
      role: "UX Designer",
    },
    {
      id: 2,
      name: "Bob Williams",
      avatar: "/a5.svg",
      role: "Frontend Developer",
    },
    {
      id: 3,
      name: "Carol Brown",
      avatar: "/a7.svg",
      role: "Data Scientist",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg text-black font-semibold">Connections</h2>
      </div>
      <div className="divide-y">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
            onClick={() => setSelectedUser(connection.id)}
          >
            <div className="flex items-center">
              <Image
                src={connection.avatar}
                alt={connection.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {connection.name}
                </p>
                <p className="text-sm text-gray-500">{connection.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedUser && (
        <ProfileDialog
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          user={connections.find((user) => user.id === selectedUser)!}
        />
      )}
    </div>
  );
}
