export async function onRequest(context: {
  request: Request;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  env: Record<string, string>;
}): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers, status: 204 });
  }

  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await context.request.json() as {
      name: string;
      email: string;
      message: string;
    };

    if (!body.name || !body.email || !body.message) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const web3res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "d015a894-a261-4995-a32a-48037329307a",
        subject: `Portfolio Contact: ${body.name}`,
        name: body.name,
        email: body.email,
        message: body.message,
        from_name: "Sanaur Rahman Portfolio",
      }),
    });

    if (!web3res.ok) {
      throw new Error("Failed to send");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
}
