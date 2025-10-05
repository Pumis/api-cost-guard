import { NextResponse } from 'next/server';

const CONVERTKIT_API_KEY = 'w2ORBBTTcrdBvkjED8B5HQ'; // Your full API key here
const CONVERTKIT_FORM_ID = '8635829';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { error: 'Invalid email' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email: email,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, data });
    } else {
      console.error('ConvertKit error:', data);
      return NextResponse.json(
        { error: 'Failed to subscribe', details: data },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}