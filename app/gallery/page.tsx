"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

type GalleryImage = {
  id: number
  src: string
  alt: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])

  useEffect(() => {
    // Fetch images from an API or load them from a local source
    // For now, we'll use dummy data
    const dummyImages: GalleryImage[] = [
      { id: 1, src: "/images/alu1.jpg", alt: "Alumni 1" },
      { id: 2, src: "/images/alu2.jpg", alt: "Alumni 2" },
      { id: 3, src: "/images/alu3.jpg", alt: "Alumni 3" },
        { id: 4, src: "/images/alu4.jpg", alt: "Alumni 4" },
        { id: 5, src: "/images/alu5.jpg", alt: "Alumni 5" },
        { id: 6, src: "/images/alu6.jpg", alt: "Alumni 6" },
        { id: 7, src: "/images/alu7.jpg", alt: "Alumni 7" },
        { id: 8, src: "/images/alu8.jpg", alt: "Alumni 8" },
        { id: 9, src: "/images/alu9.jpg", alt: "Alumni 9" },
        { id: 10, src: "/images/alu10.jpg", alt: "Alumni 10" },
        { id: 11, src: "/images/alu11.jpg", alt: "Alumni 11" },
        { id: 12, src: "/images/alu12.jpg", alt: "Alumni 12" },
        { id: 13, src: "/images/alu13.jpg", alt: "Alumni 13" },
        { id: 14, src: "/images/alu14.jpg", alt: "Alumni 14" },
        { id: 15, src: "/images/alu15.jpg", alt: "Alumni 15" },
        { id: 16, src: "/images/alu16.jpg", alt: "Alumni 16" },
        { id: 17, src: "/images/alu17.jpg", alt: "Alumni 17" },
        { id: 18, src: "/images/alu18.jpg", alt: "Alumni 18" },
       // { id: 19, src: "/images/alu19.jpg", alt: "Alumni 19" },
        
      // Add more dummy images as needed
    ]
    setImages(dummyImages)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Alumni Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <motion.div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                width={300}
                height={300}
                className="w-full h-64 object-cover"
              />
             
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

