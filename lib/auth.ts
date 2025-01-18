import { verify } from 'jsonwebtoken';
import { NextApiRequest } from 'next';

export interface DecodedToken {
  userId: number;
  email: string;
}

export function getAuthUser(req: NextApiRequest): DecodedToken | null {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    
    const decoded = verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}