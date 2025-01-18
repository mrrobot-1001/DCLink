import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../../utils/authenticate';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const chats = await prisma.connection.findMany({
      where: {
        OR: [
          { userId: user.id },
          { connectedTo: user.id }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        },
        connected: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    const formattedChats = chats.map(chat => ({
      id: chat.id,
      users: [chat.user, chat.connected],
      lastMessage: chat.messages[0]?.content || '',
      unreadCount: 0 // You'll need to implement this logic
    }));

    res.status(200).json(formattedChats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

