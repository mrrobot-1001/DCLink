"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-8 text-center">Event Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
                <CardHeader className="p-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full p-0">
                        <Image
                          src={event.thumbnail || "/placeholder.svg"}
                          alt={event.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0 backdrop-blur-md bg-white/80 rounded-lg shadow-lg">
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
                          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full shadow-md hover:shadow-lg"
                          onClick={() => prevSlide([...event.images, ...event.videos].length)}
                        >
                          <ChevronLeft className="h-6 w-6 text-gray-800" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full shadow-md hover:shadow-lg"
                          onClick={() => nextSlide([...event.images, ...event.videos].length)}
                        >
                          <ChevronRight className="h-6 w-6 text-gray-800" />
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-1 font-semibold">{event.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}