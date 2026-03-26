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
    // Get data from request body
    const data = await req.json();
    const { prompt, requestType } = data; // requestType can be 'summary' or 'smart-reply'

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let finalPrompt;
    if (requestType === 'smart-reply') {
      finalPrompt = `Based on the following email, generate three distinct, concise, and relevant smart replies. Return the replies as a JSON object with a "replies" key containing an array of strings (e.g., {"replies": ["Sounds good!", "I'll get back to you.", "Can you clarify?"]}).\n\nEmail: "${prompt}"`;
    } else {
      // Default to summarization
      finalPrompt = prompt;
    }

    // Log the incoming prompt
    console.log('Received prompt:', finalPrompt);

    // Initialize the model with generation config
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite', 
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    // Generate the content
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    // Log the response for debugging
    console.log('Generated response:', text);

    if (requestType === 'smart-reply') {
      try {
        // The response might be wrapped in markdown, so we clean it.
        let cleanedText = text;
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
        } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
        }
        
        const parsedReplies = JSON.parse(cleanedText);
        return NextResponse.json({ replies: parsedReplies.replies || [] });
      } catch (e) {
        console.error('Failed to parse smart replies JSON:', e);
        return NextResponse.json({ error: 'Failed to generate valid smart replies.' }, { status: 500 });
      }
    }

    return NextResponse.json({ result: text });
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
