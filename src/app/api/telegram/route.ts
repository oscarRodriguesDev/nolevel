import { NextRequest } from 'next/server';
import { getChatbotPrompt,ChatMessage, UserSession } from '@/utils/bot-TLG';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const sessions = new Map<number, UserSession>();

async function generateHevelynReply(chatId: number, userMessage: string): Promise<string> {
  let session = sessions.get(chatId);
  if (!session) {
    session = { messages: [] };
    sessions.set(chatId, session);
  }

  const prompt: ChatMessage[] = getChatbotPrompt(userMessage, session);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: prompt,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Desculpe, não consegui entender.';

    // Salva a resposta do bot no histórico da sessão
    session.messages.push({ role: 'assistant', content: reply });

    return reply;
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

  const reply = await generateHevelynReply(chatId, text);

  await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: reply }),
  });

  return new Response('Mensagem processada', { status: 200 });
}
