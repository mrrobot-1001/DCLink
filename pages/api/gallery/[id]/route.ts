import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { unlink } from "fs/promises"
import path from "path"

const prisma = new PrismaClient()

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const event = await prisma.galleryEvent.findUnique({
      where: { id },
      include: { images: true, videos: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Delete associated files
    await Promise.all([
      deleteFile(event.thumbnail),
      ...event.images.map((img) => deleteFile(img.path)),
      ...event.videos.map((vid) => deleteFile(vid.path)),
    ])

    // Delete the event and associated records from the database
    await prisma.galleryEvent.delete({ where: { id } })

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}

async function deleteFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), "public", filePath)
    await unlink(fullPath)
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error)
  }
}

