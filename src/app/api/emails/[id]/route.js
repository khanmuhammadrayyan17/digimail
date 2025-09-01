import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return new Response(JSON.stringify({ error: "No access token found" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const emailId = params.id;
    
    // Fetch full email content
    const emailResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}?format=full`,
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!emailResponse.ok) {
      throw new Error(`Gmail API error: ${emailResponse.status}`);
    }

    const email = await emailResponse.json();

    // Extract email content
    function extractEmailContent(payload) {
      if (payload.body && payload.body.data) {
        // Single part message
        return Buffer.from(payload.body.data, 'base64').toString('utf-8');
      }
      
      if (payload.parts) {
        // Multi-part message
        for (const part of payload.parts) {
          if (part.mimeType === 'text/plain' && part.body && part.body.data) {
            return Buffer.from(part.body.data, 'base64').toString('utf-8');
          }
          if (part.mimeType === 'text/html' && part.body && part.body.data) {
            return Buffer.from(part.body.data, 'base64').toString('utf-8');
          }
          // Recursively check nested parts
          if (part.parts) {
            const content = extractEmailContent(part);
            if (content) return content;
          }
        }
      }
      
      return '';
    }

    const content = extractEmailContent(email.payload);
    
    // Extract headers
    const headers = email.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
    const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
    const to = headers.find(h => h.name === 'To')?.value || '';
    const date = headers.find(h => h.name === 'Date')?.value || '';

    const formattedEmail = {
      id: email.id,
      threadId: email.threadId,
      subject,
      from,
      to,
      date,
      snippet: email.snippet,
      content,
      mimeType: email.payload.mimeType,
    };

    return new Response(JSON.stringify(formattedEmail), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error fetching email:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch email' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
