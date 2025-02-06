"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type GalleryEvent = {
  id: number
  title: string
  date: string
  thumbnail: string
  images: { path: string }[]
  videos: { path: string }[]
}

export default function GalleryPage() {
  const [events, setEvents] = useState<GalleryEvent[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/gallery")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const nextSlide = (totalSlides: number) => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = (totalSlides: number) => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-white mb-12 text-center">Event Gallery</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full p-0 h-auto overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={event.thumbnail || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                        <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                          View gallery
                        </Button>
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 bg-gray-900/95 backdrop-blur-md border-gray-800">
                  <div className="relative">
                    {[...event.images, ...event.videos].map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          "transition-opacity duration-300 ease-in-out",
                          currentSlide === index ? "opacity-100" : "opacity-0 hidden",
                        )}
                      >
                        {item.path.endsWith(".mp4") ? (
                          <video src={item.path} controls className="w-full h-auto rounded-lg" />
                        ) : (
                          <Image
                            src={item.path || "/placeholder.svg"}
                            alt={`Slide ${index + 1}`}
                            width={800}
                            height={600}
                            className="w-full h-auto rounded-lg"
                          />
                        )}
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20"
                      onClick={() => prevSlide([...event.images, ...event.videos].length)}
                    >
                      <ChevronLeft className="h-6 w-6 text-white" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20"
                      onClick={() => nextSlide([...event.images, ...event.videos].length)}
                    >
                      <ChevronRight className="h-6 w-6 text-white" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

