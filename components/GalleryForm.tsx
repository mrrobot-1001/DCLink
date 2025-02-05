"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"

type GalleryEvent = {
  id: number
  title: string
  date: string
  thumbnail: string
}

export default function GalleryForm({ onEventAdded }: { onEventAdded: () => void }) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [images, setImages] = useState<FileList | null>(null)
  const [videos, setVideos] = useState<FileList | null>(null)
  const [events, setEvents] = useState<GalleryEvent[]>([])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !date || !thumbnail || !images) {
      toast.error("Please fill all required fields")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("date", date)
    formData.append("thumbnail", thumbnail)

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i])
    }

    if (videos) {
      for (let i = 0; i < videos.length; i++) {
        formData.append("videos", videos[i])
      }
    }

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast.success("Event added successfully")
        setTitle("")
        setDate("")
        setThumbnail(null)
        setImages(null)
        setVideos(null)
        onEventAdded()
        fetchEvents()
      } else {
        toast.error("Failed to add event")
      }
    } catch (error) {
      console.error("Error adding event:", error)
      toast.error("An error occurred while adding the event")
    }
  }

  const handleDeleteEvent = async (id: number) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Event deleted successfully")
        fetchEvents()
      } else {
        toast.error("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("An error occurred while deleting the event")
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Event Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="date">Event Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div>
          <Label htmlFor="images">Images</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
            required
          />
        </div>
        <div>
          <Label htmlFor="videos">Videos (optional)</Label>
          <Input id="videos" type="file" accept="video/*" multiple onChange={(e) => setVideos(e.target.files)} />
        </div>
        <Button type="submit">Add Event</Button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Current Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <img
                  src={event.thumbnail || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-32 object-cover mt-2 rounded-md"
                />
                <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)} className="mt-2">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

