"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, PlusSquare, LogOut } from "lucide-react";
import UserProfileDialog from "./UserProfileDialog";

type NavbarProps = {
  onPostClick: () => void;
};

export default function Navbar({ onPostClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const currentUser = {
    name: "Jane Doe",
    avatar: "/a3.svg",
    email: "jane.doe@example.com",
    bio: "Passionate developer and tech enthusiast",
    location: "San Francisco, CA",
    website: "https://janedoe.com",
    joinDate: "January 2021",
    followers: 1234,
    following: 567,
  };

  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">DCLink</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link
              href="/about"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              About
            </Link>
            <Link
              href="/feedback"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Feedback
            </Link>
            <button
              onClick={onPostClick}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <PlusSquare className="inline-block mr-1" size={18} /> Post
            </button>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="ml-3 flex items-center"
            >
              <Image
                src={currentUser.avatar}
                alt={currentUser.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                {currentUser.name}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-500 flex items-center"
            >
              <LogOut size={18} className="mr-1" />
              Logout
            </button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              About
            </Link>
            <Link
              href="/feedback"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Feedback
            </Link>
            <button
              onClick={onPostClick}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <PlusSquare className="inline-block mr-1" size={18} /> Post
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50 flex items-center"
            >
              <LogOut size={18} className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      )}

      <UserProfileDialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
      />
    </nav>
  );
}
