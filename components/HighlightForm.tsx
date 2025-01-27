import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"

export default function HighlightForm({ onHighlightAdded }: { onHighlightAdded: () => void }) {
  const [youtubeLink, setYoutubeLink] = useState("")
  const [caption, setCaption] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeLink, caption }),
      })
      if (response.ok) {
        const newHighlight = await response.json()
        toast.success("Highlight added successfully")
        setYoutubeLink("")
        setCaption("")
        onHighlightAdded()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to add highlight")
      }
    } catch (error) {
      console.error("Error adding highlight:", error)
      toast.error("Failed to add highlight")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={youtubeLink}
        onChange={(e) => setYoutubeLink(e.target.value)}
        placeholder="YouTube Embed Link"
        required
      />
      <Input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" required />
      <Button type="submit">Add Highlight</Button>
    </form>
  )
}

