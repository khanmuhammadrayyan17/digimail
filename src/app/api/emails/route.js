import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return new Response(JSON.stringify({ error: "No access token found" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const maxResults = searchParams.get('maxResults') || '10';
    const pageToken = searchParams.get('pageToken') || '';
    const query = searchParams.get('q') || '';

    // Build Gmail API URL
    let gmailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`;
    if (pageToken) gmailUrl += `&pageToken=${pageToken}`;
    if (query) gmailUrl += `&q=${encodeURIComponent(query)}`;

    console.log('Gmail API URL:', gmailUrl); // Debug log to see the query

    // Fetch messages list
    const messagesResponse = await fetch(gmailUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!messagesResponse.ok) {
      throw new Error(`Gmail API error: ${messagesResponse.status}`);
    }

    const messagesData = await messagesResponse.json();
    
    if (!messagesData.messages) {
      return new Response(JSON.stringify({ messages: [], nextPageToken: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch detailed information for each message
    const emailPromises = messagesData.messages.map(async (message) => {
      const emailResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (emailResponse.ok) {
        return await emailResponse.json();
      }
      return null;
    });

    const emails = await Promise.all(emailPromises);
    const validEmails = emails.filter(email => email !== null);

    // Format the emails for easier use
    const formattedEmails = validEmails.map(email => {
      const headers = email.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
      const date = headers.find(h => h.name === 'Date')?.value || '';
      
      return {
        id: email.id,
        threadId: email.threadId,
        subject,
        from,
        date,
        snippet: email.snippet,
      };
    });

    return new Response(JSON.stringify({ 
      messages: formattedEmails, 
      nextPageToken: messagesData.nextPageToken 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error fetching emails:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch emails' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
