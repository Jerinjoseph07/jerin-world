exports.handler = async () => {
  const MY_SITE_ID = process.env.MY_SITE_ID;
  const TOKEN = process.env.NETLIFY_API_TOKEN;

  if (!MY_SITE_ID || !TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: "Environment variables not set" }) };
  }

  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${MY_SITE_ID}/forms`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    const forms = await res.json();
    const guestbook = forms.find(f => f.name === "guestbook");

    if (!guestbook) {
      return { statusCode: 404, body: JSON.stringify({ error: "Guestbook form not found" }) };
    }

    const submissionsRes = await fetch(
      `https://api.netlify.com/api/v1/forms/${guestbook.id}/submissions`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );

    const submissions = (await submissionsRes.json()).sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    return { statusCode: 200, body: JSON.stringify(submissions) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
