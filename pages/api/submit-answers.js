import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, answers, questions, results } = req.body;

    // Validate required fields
    if (!username || !answers) {
      return res.status(400).json({ message: 'Username and answers are required' });
    }

    // Save to database using Prisma
    const quizResult = await prisma.quizResult.create({
      data: {
        username: username.trim(),
        data: {
          answers, // Now indexed by original question indices
          questions, // Original questions array for context
          results,
          timestamp: new Date().toISOString()
        }
      }
    });

    console.log('Saved submission with ID:', quizResult.id);

    res.status(200).json({ 
      message: 'Answers submitted successfully',
      id: quizResult.id,
      username 
    });
  } catch (error) {
    console.error('Error saving answers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 