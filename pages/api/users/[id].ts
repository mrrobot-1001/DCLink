import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../../../utils/authenticate'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const user = authenticate(req)
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query

  try {
    const userData = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        connections: true,
      },
    })

    if (!userData) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Remove sensitive information
    const { password, ...userWithoutPassword } = userData

    res.status(200).json(userWithoutPassword)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ message: 'Error fetching user' })
  }
}

