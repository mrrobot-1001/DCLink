// pages/api/user.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

// Initialize Prisma client
const prisma = new PrismaClient();

// Secret for JWT token (should be in .env for security)
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "f7a5c1c2b6e2df8e9bff13a8b6deef3d7c84f4d9ae9f9b5b8aef7e6f8c5d4b3a5e6c7d8e9b0a7f1e6f3d9a5c4b8d3f2a6c4d5b9e7a0f2";

// Function to verify JWT token
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided." });
    }

    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token." });
    }

    try {
      // Fetch user from the database
      const user = await prisma.user.findUnique({
        where: {
          email: decoded.email, // Assuming the email is part of the JWT payload
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch user data." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
