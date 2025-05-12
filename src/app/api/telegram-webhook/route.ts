import { NextRequest } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function generateBotReply(userMessage: string): Promise<string> {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo', // ou 'gpt-3.5-turbo' se quiser mais rápido/barato
        messages: [
          {
            role: 'system',
            content: 'Você é uma assistente virtual chamada Hevelyn. Responda de forma empática e prestativa, especialmente sobre assuntos relacionados a trabalho e saúde.',
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'Desculpe, não consegui entender.';
  } catch (err) {
    console.error('Erro ao gerar resposta do GPT:', err);
    return 'Tivemos um erro ao processar sua mensagem. Tente novamente mais tarde.';
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const chatId = body?.message?.chat?.id;
  const text = body?.message?.text;

  if (!chatId || !text) {
    return new Response('Ignorado (sem chatId ou texto)', { status: 200 });
  }

  const reply = await generateBotReply(text);

  await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: reply }),
  });

  return new Response('Mensagem processada', { status: 200 });
}


//rode:

/* curl -X POST https://api.telegram.org/8134191465:AAEE8br6VOsGEgUCo_1Qu8MWzt9B-urKZQE/setWebhook \
  -d "url=https://meu-bot-telegram.vercel.app/api/telegram/webhook" */