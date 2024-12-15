import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface MCQResponse {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export  async function POST(req: NextRequest) {
  // Validate OpenAI API Key
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API Key is not configured' }, { status: 500 });
  }

  try {
    // Extract topic from the request body
    const { topic }: { topic: string } = await req.json(); // Make sure to await req.json() and type it

    // Validate topic
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Prompt for generating MCQ
    const prompt = `Generate a multiple-choice question about ${topic} at a difficulty level. 
    Provide the following in a structured JSON format:
    {
      "question": "The MCQ question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct option",
      "explanation": "A detailed explanation of why this is the correct answer"
    }`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4 if available
      messages: [
        { role: "system", content: "You are a helpful assistant that generates multiple-choice questions in a strict JSON format." },
        { role: "user", content: prompt }
      ]
    });

    // Parse the response
    const mcqResponse = JSON.parse(completion.choices[0].message.content || '{}') as MCQResponse;

    // Validate the generated MCQ
    if (!mcqResponse.question || !mcqResponse.options || !mcqResponse.correctAnswer) {
      throw new Error('Invalid MCQ generation');
    }

    // Return the MCQ
    return NextResponse.json(mcqResponse);

  } catch (error:any) {
    if (error.response?.status === 429) {
      // Handle rate-limiting error
      return NextResponse.json({ error: 'You have exceeded the API request quota. Please try again later.' }, { status: 429 });
    }

    console.error('MCQ Generation Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error occurred' }, { status: 500 });
  }
}
