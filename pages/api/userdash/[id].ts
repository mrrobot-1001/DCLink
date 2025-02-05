import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../../../utils/authenticate"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Authenticate the request
  const currentUser = authenticate(req)
  if (!currentUser) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { id } = req.query
  const userId = Number(id)

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" })
  }

  if (userId === currentUser.id) {
    return res.status(400).json({ error: "Cannot delete your own account" })
  }

  if (req.method === "DELETE") {
    try {
      // Delete all associated data in a transaction
      await prisma.$transaction(async (tx) => {
        // Delete user's messages
        await tx.message.deleteMany({
          where: { authorId: userId },
        })

        // Delete user's chat participants
        await tx.chatParticipant.deleteMany({
          where: { userId: userId },
        })

        // Delete chats where this user is the only participant
        const chatsToDelete = await tx.chat.findMany({
          where: {
            participants: {
              every: {
                userId: userId,
              },
            },
          },
        })

        for (const chat of chatsToDelete) {
          await tx.chat.delete({
            where: { id: chat.id },
          })
        }

        // Delete user's connections
        await tx.connection.deleteMany({
          where: {
            OR: [
              { userId: userId },
              { connectedTo: userId },
            ],
          },
        })

        // Delete user's posts
        await tx.post.deleteMany({
          where: { authorId: userId },
        })

        // Delete user's comments
        await tx.comment.deleteMany({
          where: { authorId: userId },
        })

        // Delete user's highlights
        await tx.highlight.deleteMany({
          where: { userId: userId },
        })

        // Finally, delete the user
        await tx.user.delete({
          where: { id: userId },
        })
      })

      res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
      console.error("Error deleting user:", error)
      res.status(500).json({ error: "Failed to delete user" })
    }
  } else {
    res.setHeader("Allow", ["DELETE"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
