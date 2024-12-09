"use client";

import { useState, useRef } from "react";
import { X, ImageIcon } from "lucide-react";

type PostFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PostForm({ isOpen, onClose }: PostFormProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the post data to your backend
    console.log("Submitting post:", { content, image });
    setContent("");
    setImage(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-32 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center text-gray-600 hover:text-indigo-600"
            >
              <ImageIcon size={20} className="mr-2" />
              Add Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Post
            </button>
          </div>
          {image && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Selected image: {image.name}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
