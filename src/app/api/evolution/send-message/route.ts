// app/api/evolution/send-message/route.ts
export async function POST(request: Request) {
  const body = await request.json();

  const { number, message } = body;

  const instanceId = process.env.EVOLUTION_INSTANCE_ID!;
  const token = process.env.EVOLUTION_TOKEN!;

  const response = await fetch(`https://api.evolution-api.com/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': token,
    },
    body: JSON.stringify({
      instanceId,
      number,
      message,
    }),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
