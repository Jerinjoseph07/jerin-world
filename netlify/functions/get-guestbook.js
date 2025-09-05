const fetch = require("node-fetch");

exports.handler = async () => {
  const MY_SITE_ID = process.env.MY_SITE_ID;
  const TOKEN = process.env.NETLIFY_API_TOKEN;

  if (!MY_SITE_ID || !TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Environment variables not set" }),
    };
  }

  try {
    // Get all forms
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${MY_SITE_ID}/forms`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    const forms = await res.json();
    const guestbook = forms.find(f => f.name === "guestbook");

    if (!guestbook) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Guestbook form not found" }),
      };
    }

    // Get submissions
    const submissionsRes = await fetch(
      `https://api.netlify.com/api/v1/forms/${guestbook.id}/submissions`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );

    const submissions = await submissionsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(submissions),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
