"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export default function ContentSection() {
  const highlights = [
    {
      id: 1,
      title: "New Feature Launch",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: 2,
      title: "Community Meetup",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: 3,
      title: "Tech Conference",
      image: "/placeholder.svg?height=100&width=200",
    },
  ];

  const blogs = [
    {
      id: 1,
      author: "Alice Wonder",
      avatar: "/a4.svg",
      image: "/nvidia.jpg",
      caption:
        "Exploring the future of AI and its impact on our daily lives. What are your thoughts?",
      likes: 42,
      comments: 15,
    },
    {
      id: 2,
      author: "Bob Builder",
      avatar: "/a5.svg",
      image: "/placeholder.svg?height=400&width=400",
      caption:
        "Just launched a new website! Check out these amazing web development trends we incorporated.",
      likes: 38,
      comments: 22,
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Highlights</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {highlights.map((highlight) => (
            <motion.div
              key={highlight.id}
              className="flex-shrink-0 w-48"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={highlight.image}
                alt={highlight.title}
                width={200}
                height={100}
                className="w-full h-24 object-cover rounded-lg mb-2"
              />
              <p className="text-sm font-semibold text-gray-700">
                {highlight.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Posts</h2>
          <div className="space-y-6">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                className="bg-gray-50 rounded-lg shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={blog.avatar}
                      alt={blog.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-semibold text-gray-800">
                      {blog.author}
                    </span>
                  </div>
                  <MoreHorizontal size={20} className="text-gray-500" />
                </div>
                <Image
                  src={blog.image}
                  alt="Blog post"
                  width={400}
                  height={400}
                  className="w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex space-x-4">
                      <button className="flex items-center text-sm text-gray-600">
                        <Heart size={20} className="mr-1" /> {blog.likes}
                      </button>
                      <button className="flex items-center text-sm text-gray-600">
                        <MessageCircle size={20} className="mr-1" />{" "}
                        {blog.comments}
                      </button>
                    </div>
                    <button className="flex items-center text-sm text-gray-600">
                      <Share2 size={20} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">{blog.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
