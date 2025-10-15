import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

export const dynamic = 'force-dynamic';

// Initialize the API with defaults for all requests
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    // Get the prompt from request body
    const data = await req.json();
    const { prompt } = data;
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Log the incoming prompt
    console.log('Received prompt:', prompt);

    // Initialize the model with generation config
    const model = genAI.getGenerativeModel({
      model: 'models/gemini-2.0-flash-lite',  // Using the Flash-Lite model for higher rate limits
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    // Generate the content (wrap prompt in array as required by the API)
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text();

    // Log the response for debugging
    console.log('Generated response:', text);

    return NextResponse.json({ result: text })
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error.message
      },
      { status: 500 }
    );
  }
}
