import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

async function createReplyDraft(accessToken, to, subject, body, threadId) {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    '',
    body
  ].join('\n');

  const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const gmailResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: encodedMessage,
      threadId: threadId
    })
  });

  if (!gmailResponse.ok) {
    const error = await gmailResponse.json();
    console.error('Gmail API error:', error);
    throw new Error('Failed to send email via Gmail API.');
  }

  return await gmailResponse.json();
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, body, threadId } = await req.json();

    if (!to || !subject || !body || !threadId) {
      return NextResponse.json({ error: 'Missing required fields: to, subject, body, threadId' }, { status: 400 });
    }

    const result = await createReplyDraft(session.accessToken, to, subject, body, threadId);

    return NextResponse.json({ message: 'Email sent successfully', result });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
  }
}
