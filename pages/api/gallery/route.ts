import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { writeFile } from "fs/promises"
import path from "path"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const events = await prisma.galleryEvent.findMany({
      include: {
        images: true,
        videos: true,
      },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const date = formData.get("date") as string
    const thumbnail = formData.get("thumbnail") as File
    const images = formData.getAll("images") as File[]
    const videos = formData.getAll("videos") as File[]

    // Save thumbnail
    const thumbnailPath = await saveFile(thumbnail, "thumbnails")

    // Save images
    const imagePaths = await Promise.all(images.map((image) => saveFile(image, "images")))

    // Save videos
    const videoPaths = await Promise.all(videos.map((video) => saveFile(video, "videos")))

    // Create event in database
    const event = await prisma.galleryEvent.create({
      data: {
        title,
        date: new Date(date),
        thumbnail: thumbnailPath,
        images: {
          create: imagePaths.map((path) => ({ path })),
        },
        videos: {
          create: videoPaths.map((path) => ({ path })),
        },
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

async function saveFile(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${file.name}`
  const filepath = path.join(process.cwd(), "public", folder, filename)
  await writeFile(filepath, buffer)

  return `/${folder}/${filename}`
}

