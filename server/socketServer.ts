import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

declare global {
  var socketIo: SocketIOServer | undefined;
}

export function initializeSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join chat', (chatId) => {
      socket.join(`chat_${chatId}`);
    });

    socket.on('leave chat', (chatId) => {
      socket.leave(`chat_${chatId}`);
    });

    socket.on('clear chat', async (chatId) => {
      try {
        await prisma.message.deleteMany({
          where: { connectionId: chatId },
        });
        io.to(`chat_${chatId}`).emit('chat cleared');
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  global.socketIo = io;
  return io;
}

export function emitNewMessage(chatId: number, message: any) {
  const io = global.socketIo;
  if (io) {
    io.to(`chat_${chatId}`).emit('new message', message);
  }
}

export function emitChatUpdate(userId: number, chat: any) {
  const io = global.socketIo;
  if (io) {
    io.to(`user_${userId}`).emit('chat update', chat);
  }
}

