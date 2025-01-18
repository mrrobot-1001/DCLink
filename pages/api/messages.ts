import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../../utils/authenticate';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { chatId } = req.query;

    if (!chatId || typeof chatId !== 'string') {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    try {
      const messages = await prisma.message.findMany({
        where: {
          connectionId: parseInt(chatId),
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ error: 'Chat ID and content are required' });
    }

    try {
      const newMessage = await prisma.message.create({
        data: {
          content,
          senderId: user.id,
          connectionId: chatId,
        },
      });

      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

