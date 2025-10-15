import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

// Explicitly set API version to v1
const genAI = new GoogleGenerativeAI(apiKey)

export async function POST(req) {
  try {
    // Get the prompt from request body
    const data = await req.json()
    const { prompt } = data
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }
    console.log(prompt);
    let model;
    try {
      model = genAI.getGenerativeModel({
        model: 'models/gemini-1.5-flash-latest',
      });
    } catch (error) {
      console.error('Error initializing model:', error);
      return NextResponse.json(
        { error: 'Specified model not found. Check available models in logs.' },
        { status: 404 }
      );
    }
    const result = await model.generateContent(prompt);
    let text;
    if (result && result.response) {
      text = result.response.text();
    }
    
    console.log('Generated response:', text);
    return NextResponse.json({ result: text })
  } catch (error) { 
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
