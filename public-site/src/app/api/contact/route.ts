export async function POST(request: Request) {
  const { name, email, inquiry, message } = await request.json();

  if (!name || !email || !message) {
    return Response.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Email configuration
  const recipientEmail = process.env.CONTACT_EMAIL || 'support@tjrmindbody.com';
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  if (!sendgridApiKey) {
    console.error('SENDGRID_API_KEY not configured');
    return Response.json(
      { error: 'Email service not configured' },
      { status: 500 }
    );
  }

  try {
    const emailContent = `
Name: ${name}
Email: ${email}
Inquiry Type: ${inquiry}

Message:
${message}
    `.trim();

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: recipientEmail }],
          },
        ],
        from: { email: 'support@tjrmindbody.com', name: 'TJR Mind & Body' },
        reply_to: { email },
        subject: `New enquiry from ${name}: ${inquiry}`,
        content: [
          {
            type: 'text/plain',
            value: emailContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('SendGrid error:', await response.text());
      return Response.json(
        { error: 'Failed to send email' },
        { status: response.status }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
