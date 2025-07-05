import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const results = await prisma.quizResult.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({ 
      results: results.map(result => ({
        id: result.id,
        username: result.username,
        answers: result.data.answers,
        questions: result.data.questions,
        results: result.data.results,
        createdAt: result.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching admin results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 