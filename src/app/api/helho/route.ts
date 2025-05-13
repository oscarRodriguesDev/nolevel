// app/api/hello/route.ts

export async function GET(request: Request) {
  return new Response(JSON.stringify({ message: 'Olá, mundo!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return new Response(JSON.stringify({ recebido: body }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}