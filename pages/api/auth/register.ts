import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from ".prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
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
    } = req.body

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    try {
      // Log incoming data for debugging
      console.log("Incoming registration data:", {
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
      })

      // Check if username or email already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      })

      if (existingUser) {
        return res.status(409).json({
          message: "Email or username already in use",
        })
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create the user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          bio: bio || null,
          location: location || null,
          website: website || null,
          instagramProfile: instagramProfile || null,
          githubProfile: githubProfile || null,
          linkedinProfile: linkedinProfile || null,
          skills: skills || null,
          currentlyWorkingAt: currentlyWorkingAt || null,
          pastWorkedAt: pastWorkedAt || null,
          joinDate: new Date(),
          session: session || null,
          isAdmin: isAdmin || false,
        },
      })

      // Log the newly created user
      console.log("User registered successfully:", newUser)

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
        },
      })
    } catch (error) {
      console.error("Error during registration:", error)

      // Handle known Prisma errors
      if (error instanceof Error && "code" in error && error.code === "P2002") {
        return res.status(409).json({ message: "Email or username already in use" })
      }

      // Return generic error for unknown issues
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

