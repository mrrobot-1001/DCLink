"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, Plus, Youtube } from 'lucide-react';
import Image from "next/image";
import { useState } from "react";

export default function ContentSection() {
  const [highlights, setHighlights] = useState([
    {
      id: 1,
      title: "Teacher's and freshers day",
      image: "/images/dclogo.png",
      youtubeLink: "https://www.youtube.com/watch?v=BYvXl5F5YTQ",
    },
    {
      id: 2,
      title: "Induction (CS)",
      image: "/images/dclogo.png",
      youtubeLink: "https://www.youtube.com/watch?v=ny-bWDLGA9o",
    },
    {
      id: 3,
      title: "Soft Skill",
      image: "/images/dclogo.png",
      youtubeLink: "https://www.youtube.com/watch?v=QwYchYZRGd4",
    },
  ]);

  const [newHighlight, setNewHighlight] = useState({ title: "", youtubeLink: "" });

  const addHighlight = () => {
    if (newHighlight.title && newHighlight.youtubeLink) {
      const videoId = new URL(newHighlight.youtubeLink).searchParams.get("v");
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      setHighlights([
        ...highlights,
        {
          id: highlights.length + 1,
          title: newHighlight.title,
          image: thumbnailUrl,
          youtubeLink: newHighlight.youtubeLink,
        },
      ]);
      setNewHighlight({ title: "", youtubeLink: "" });
    }
  };

  const blogs = [
    {
      id: 1,
      author: "Priyansh",
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
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Add New Highlight</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Title"
              value={newHighlight.title}
              onChange={(e) =>
                setNewHighlight({ ...newHighlight, title: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="YouTube Link"
              value={newHighlight.youtubeLink}
              onChange={(e) =>
                setNewHighlight({ ...newHighlight, youtubeLink: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addHighlight}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </button>
          </div>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {highlights.map((highlight) => (
            <motion.div
              key={highlight.id}
              className="flex-shrink-0 w-48"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <a href={highlight.youtubeLink} target="_blank" rel="noopener noreferrer" className="group">
                <div className="relative">
                  <Image
                    src={highlight.image || "/placeholder.svg"}
                    alt={highlight.title}
                    width={200}
                    height={100}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <Youtube className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700 truncate">
                  {highlight.title}
                </p>
              </a>
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
                      src={blog.avatar || "/placeholder.svg"}
                      alt={blog.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-semibold text-gray-800">
                      {blog.author}
                    </span>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </div>
                <Image
                  src={blog.image || "/placeholder.svg"}
                  alt="Blog post"
                  width={400}
                  height={400}
                  className="w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex space-x-4">
                      <button className="flex items-center text-sm text-gray-600">
                        <Heart className="w-5 h-5 mr-1" />
                        {blog.likes}
                      </button>
                      <button className="flex items-center text-sm text-gray-600">
                        <MessageCircle className="w-5 h-5 mr-1" />
                        {blog.comments}
                      </button>
                    </div>
                    <button className="flex items-center text-sm text-gray-600">
                      <Share2 className="w-5 h-5" />
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

