// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { prompt } from '../../../utils/botWhats';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type AtendimentoState =
  | 'AGUARDANDO_NOME'
  | 'AGUARDANDO_CPF'
  | 'ATENDIMENTO_INICIADO';

interface Session {
  nome?: string;
  cpf?: string;
  state: AtendimentoState;
}

const sessions = new Map<string, Session>();

// Função simples para validação de CPF (apenas formato)
const validaCPF = (cpf: string) => /^\d{11}$/.test(cpf);

export async function POST(req: Request) {
  try {
    const { userId, message } = await req.json(); // Espera { userId, message }
    let session = sessions.get(userId);

    if (!session) {
      session = { state: 'AGUARDANDO_NOME' };
      sessions.set(userId, session);
      return NextResponse.json({
        response: 'Olá! Me chamo Hevelyn, da equipe administrativa. Para começar, por favor, me diga seu nome completo.',
      });
    }

    switch (session.state) {
      case 'AGUARDANDO_NOME':
        session.nome = message;
        session.state = 'AGUARDANDO_CPF';
        return NextResponse.json({ response: 'Obrigada! Agora, me informe seu CPF (somente números).' });

      case 'AGUARDANDO_CPF':
        if (!validaCPF(message)) {
          return NextResponse.json({ response: 'Esse CPF parece inválido. Por favor, verifique e me envie novamente.' });
        }
        session.cpf = message;
       

     
        session.state = 'ATENDIMENTO_INICIADO';
        return NextResponse.json({
          response: `Tudo certo, ${session.nome}! Agora me conta com o que posso te ajudar no setor administrativo.`,
        });

      case 'ATENDIMENTO_INICIADO': {
        const fullPrompt = `
${prompt()}

---
Dados do colaborador:
- Nome: ${session.nome}
- CPF: ${session.cpf}


Mensagem recebida do colaborador: "${message}"

Gere uma resposta empática e apropriada.
        `.trim();

        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          temperature: 0.7,
          messages: [{ role: 'user', content: fullPrompt }],
        });

        const response = completion.choices[0].message.content;
        return NextResponse.json({ response });
      }

      default:
        return NextResponse.json({
          response: 'Desculpe, ocorreu um erro na conversa. Pode tentar novamente?',
        });
    }
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao gerar resposta' }, { status: 500 });
  }
}
