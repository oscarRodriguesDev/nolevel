// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getChatbotPrompt,UserSession } from '../../../utils/botWhats'

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type SessionMap = Map<string, UserSession>;
const sessions: SessionMap = new Map();

function getSession(sessionId: string): UserSession {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { messages: [] });
  }
  return sessions.get(sessionId)!;
}


export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    const session = getSession(sessionId);
    const messages = getChatbotPrompt(message, session);

    // Guarda no histórico (exceto se for prompt de solicitação de nome/setor)
    session.messages.push({ role: 'assistant', content: message });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.7, // Mais "humano"
      messages,
    });

    const response = completion.choices[0].message.content;
    // Simula o tempo de resposta humano
 

    session.messages.push({ role: 'system', content:response });

    return NextResponse.json({ response });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao gerar resposta' }, { status: 500 });
  }
}
