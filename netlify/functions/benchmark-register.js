const FREE_DOMAINS = [
  "gmail.com","googlemail.com","yahoo.com","yahoo.fr","yahoo.co.uk",
  "hotmail.com","hotmail.fr","hotmail.co.uk","outlook.com","outlook.fr",
  "live.com","live.fr","msn.com","icloud.com","me.com","mac.com",
  "free.fr","orange.fr","laposte.net","sfr.fr","bbox.fr","wanadoo.fr",
  "numericable.fr","neuf.fr","aol.com","protonmail.com","pm.me",
  "tutanota.com","gmx.com","gmx.fr","mailinblack.com"
];

const SUPABASE_URL = "https://xdtjdutzqfzybgalgejd.supabase.co";

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch(e) { return { statusCode: 400, body: JSON.stringify({ error: "Corps invalide" }) }; }

  const email = (body.email || "").trim().toLowerCase();
  const firstName = (body.firstName || "").trim();
  const lastName  = (body.lastName  || "").trim();
  const company   = (body.company   || "").trim();

  if (!email) return { statusCode: 400, body: JSON.stringify({ error: "Email requis" }) };

  // Validation email professionnel
  const domain = email.split("@")[1] || "";
  if (!domain || FREE_DOMAINS.includes(domain)) {
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Merci d'utiliser votre adresse email professionnelle (pas de Gmail, Hotmail, Yahoo…)." })
    };
  }

  // Vérifier doublon
  try {
    const check = await fetch(
      `${SUPABASE_URL}/rest/v1/benchmark_repondants?email=eq.${encodeURIComponent(email)}&limit=1`,
      {
        headers: {
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );
    const existing = await check.json();
    if (existing && existing.length > 0) {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Vous avez déjà participé au benchmark. Merci pour votre contribution !" })
      };
    }
  } catch(e) { /* on laisse passer si erreur réseau */ }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorized: true, firstName, lastName, company, email })
  };
};
