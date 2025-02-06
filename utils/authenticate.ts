import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "f7a5c1c2b6e2df8e9bff13a8b6deef3d7c84f4d9ae9f9b5b8aef7e6f8c5d4b3a5e6c7d8e9b0a7f1e6f3d9a5c4b8d3f2a6c4d5b9e7a0f2";

export const authenticate = (req: NextApiRequest) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return null;
  }

  try {
    // Verify the token and return the decoded user data
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { id: number; email: string };
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
};
