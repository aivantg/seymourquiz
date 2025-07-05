import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const results = await prisma.quizResult.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to most recent 10 results
    });

    res.status(200).json({ 
      results: results.map(result => ({
        id: result.id,
        username: result.username,
        bestPerson: result.data.results?.bestPerson,
        createdAt: result.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 