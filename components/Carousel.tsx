import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CarouselItem = {
  type: "image" | "video"
  src: string
  alt?: string
}

const carouselItems: CarouselItem[] = [
  { type: "image", src: "/images/alu6.jpg", alt: "Carousel Image 1" },
  { type: "video", src: "https://www.youtube.com/embed/avxZ_flumuo" },
  { type: "image", src: "/images/alu3.jpg", alt: "Carousel Image 2" },
]

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1))
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
      {carouselItems.map((item, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {item.type === "image" ? (
            <Image src={item.src || "/placeholder.svg"} alt={item.alt || ""} layout="fill" objectFit="cover" />
          ) : (
            <iframe src={item.src} className="w-full h-full" allowFullScreen></iframe>
          )}
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}

