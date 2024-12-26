import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

export const authenticate = (req: NextApiRequest) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return null;
  }

  try {
    // Verify the token and return the decoded user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { id: number; email: string };
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
};
