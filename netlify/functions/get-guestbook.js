exports.handler = async (event, context) => {
  const fetch = require("node-fetch");

  // Your Netlify site ID + API token (add in Netlify dashboard → Site Settings → Build & Deploy → Environment)
  const SITE_ID = process.env.SITE_ID;
  const TOKEN = process.env.NETLIFY_API_TOKEN;

  const response = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/forms`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  });

  const forms = await response.json();
  const guestbook = forms.find(f => f.name === "guestbook");

  if (!guestbook) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Guestbook not found" })
    };
  }

  // Get submissions
  const submissionsResponse = await fetch(
    `https://api.netlify.com/api/v1/forms/${guestbook.id}/submissions`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` }
    }
  );

  const submissions = await submissionsResponse.json();

  return {
    statusCode: 200,
    body: JSON.stringify(submissions)
  };
};
