export async function POST(request: Request) {
  const { email, firstName } = await request.json();

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    return Response.json(
      { error: 'Missing Mailchimp configuration' },
      { status: 500 }
    );
  }

  // Extract datacenter from API key (e.g., 'us20' from key-us20)
  const datacenter = apiKey.split('-')[1];
  const auth = Buffer.from(`anystring:${apiKey}`).toString('base64');

  try {
    const response = await fetch(
      `https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: firstName || '',
          },
          tags: ['website_lead'],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle duplicate email gracefully
      if (data.title === 'Member Exists') {
        return Response.json(
          { success: true, message: 'Email already subscribed' },
          { status: 200 }
        );
      }
      return Response.json(
        { error: data.detail || 'Failed to subscribe' },
        { status: response.status }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Mailchimp error:', error);
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
