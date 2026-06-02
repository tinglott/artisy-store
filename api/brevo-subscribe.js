/**
 * Vercel Serverless Function: Email Subscribe via Brevo
 * Endpoint: /api/brevo-subscribe
 * Method: POST
 * Body: { email: "user@example.com" }
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  // Get Brevo API key from environment variables
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.error('BREVO_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const listId = 3; // Divine Resonance list

  try {
    // Call Brevo API to add contact to list
    const response = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmationEmail/emails', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'api-key': brevoApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        includeListIds: [listId],
        templateId: 1, // Default double opt-in template
        redirectUrl: 'https://shop.artistrystore.com' // Redirect after confirmation
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      
      // If contact already exists, that's fine
      if (errorData.code === 'duplicate_parameter') {
        return res.status(200).json({ 
          success: true, 
          message: 'Email already registered' 
        });
      }
      
      return res.status(response.status).json({ 
        error: 'Failed to subscribe email',
        details: errorData 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Confirmation email sent! Please check your inbox.' 
    });

  } catch (error) {
    console.error('Error processing subscription:', error);
    return res.status(500).json({ 
      error: 'Server error processing subscription',
      message: error.message 
    });
  }
}