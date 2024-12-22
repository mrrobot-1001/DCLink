import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Only allow GET requests for fetching user details
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  // If no token is provided, return an error
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the JWT token and decode it
    const secret = process.env.JWT_SECRET as string; // Ensure JWT_SECRET is in your .env file
    const decoded = jwt.verify(token, secret) as { userId: number };

    // Fetch the logged-in user's data from the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        location: true,
        website: true,
        joinDate: true,
      },
    });

    // If no user is found, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data if found
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default handler;
