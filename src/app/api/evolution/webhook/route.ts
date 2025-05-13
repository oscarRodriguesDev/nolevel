// app/api/evolution/webhook/route.ts
export async function POST(request: Request) {
  const payload = await request.json();

  console.log('🔔 Mensagem recebida:', payload);

  // Você pode tratar, salvar no banco, ou responder com outra função aqui.

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
