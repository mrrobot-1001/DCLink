import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getAuthUser } from '../../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId } = req.query;
    const targetUserId = parseInt(userId as string, 10);

    const connection = await prisma.connection.findFirst({
      where: {
        userId: user.userId,
        connectedTo: targetUserId
      }
    });

    return res.status(200).json({ isConnected: !!connection });
  } catch (error) {
    console.error('Error checking connection status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}