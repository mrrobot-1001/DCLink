import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from ".prisma/client"
import bcrypt from "bcrypt"
import { IncomingForm } from "formidable"
import { promises as fs } from "fs"
import path from "path"

const prisma = new PrismaClient()

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const form = new IncomingForm()
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ message: "Error parsing form data" })
        }

        const {
          username,
          email,
          password,
          bio,
          location,
          website,
          instagramProfile,
          githubProfile,
          linkedinProfile,
          skills,
          currentlyWorkingAt,
          pastWorkedAt,
          session,
          isAdmin,
        } = fields

        // Validate required fields
        if (!username || !email || !password) {
          return res.status(400).json({ message: "Missing required fields" })
        }

        // Check if username or email already exists
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ username: username as string }, { email: email as string }],
          },
        })

        if (existingUser) {
          return res.status(409).json({
            message: "Email or username already in use",
          })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password as string, 10)

        // Handle profile picture upload
        let profilePicturePath = null
        if (files.profilePicture) {
          const file = files.profilePicture as formidable.File
          const fileName = `${Date.now()}-${file.originalFilename}`
          const uploadDir = path.join(process.cwd(), "public", "uploads")
          await fs.mkdir(uploadDir, { recursive: true })
          await fs.copyFile(file.filepath, path.join(uploadDir, fileName))
          profilePicturePath = `/uploads/${fileName}`
        }

        // Create the user
        const newUser = await prisma.user.create({
          data: {
            username: username as string,
            email: email as string,
            password: hashedPassword,
            bio: (bio as string) || null,
            location: (location as string) || null,
            website: (website as string) || null,
            instagramProfile: (instagramProfile as string) || null,
            githubProfile: (githubProfile as string) || null,
            linkedinProfile: (linkedinProfile as string) || null,
            skills: (skills as string) || null,
            currentlyWorkingAt: (currentlyWorkingAt as string) || null,
            pastWorkedAt: (pastWorkedAt as string) || null,
            joinDate: new Date(),
            session: (session as string) || null,
            isAdmin: isAdmin === "true",
            profilePicture: profilePicturePath,
          },
        })

        // Respond with success
        return res.status(201).json({
          message: "User registered successfully",
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            bio: newUser.bio,
            location: newUser.location,
            website: newUser.website,
            instagramProfile: newUser.instagramProfile,
            githubProfile: newUser.githubProfile,
            linkedinProfile: newUser.linkedinProfile,
            skills: newUser.skills,
            currentlyWorkingAt: newUser.currentlyWorkingAt,
            pastWorkedAt: newUser.pastWorkedAt,
            joinDate: newUser.joinDate,
            session: newUser.session,
            isAdmin: newUser.isAdmin,
            profilePicture: newUser.profilePicture,
          },
        })
      })
    } catch (error) {
      console.error("Error during registration:", error)
      return res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  } else if (req.method === "GET") {
    try {
      // Fetch all users from the database
      const users = await prisma.user.findMany()

      // Respond with the list of users
      return res.status(200).json(users)
    } catch (error) {
      console.error("Error fetching users:", error)
      return res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
}

