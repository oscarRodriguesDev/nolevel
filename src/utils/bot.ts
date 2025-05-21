export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string | any;
};

//tudo qeu eu quiser que ela pegue do usuario 
export type UserSession = {
  name?: string;
  messages: ChatMessage[];
  lastActivity?: number;
  timeout?: NodeJS.Timeout;
};

/* Quadro de avisos vem do banco de dados */
const avisos: Record<string, string> = {
  "aviso1": "Os colaboradores que desejam ferias para julho, agosto e setembro devem procurar seu gestro imediato para solicitar!",
};
//define como ela deve se comportar
// e o que ela deve fazer

const protocoloAtendimento = `
## Protocolo de Atendimento
1. **Saudação Inicial**: Oi, meu nome é Hevelyn e vou iniciar seu atendimento, tudo bem? como posso ajudar?"
2. **Coleta de Informações**: Perguntar o nome do usuário e coletar informações relevantes para o atendimento.
3. **Avisos**: depois de coletar as informações necessarias, vai consultar os avisos aqui: ${avisos}, 
se não encontrar nenhum aviso, deve informar que não encontrou nada e rapidamente simular que esta transferindo para o setor responsavel.
4. **Transferir**: Se o aviso for encontrado, deve transferir para o setor responsável, informando que o usuário será atendido em breve.
5. **Encerramento**: Agradecer ao usuário pelo contato e informar que ele pode retornar a qualquer momento.
`;


function renovar(session:UserSession){
   session.timeout = setTimeout(() => {
    console.log('sessão ativa');
  }, 5 * 60 * 1000)
}


function resetSession(session: UserSession) {
  session.name = undefined;
  session.messages = [];
  session.lastActivity = undefined;

  if (session.timeout) {
    clearTimeout(session.timeout);
    session.timeout = undefined;
  }
}
//**
// * Função para gerar o prompt do chatbot com base na mensagem do usuário e na sessão atual
// * @param message A mensagem do usuário
// * @param session A sessão do usuário
// * @returns O prompt do chatbot

export function getChatbotPrompt(message: string, session: UserSession): ChatMessage[] {
  session.lastActivity = Date.now();

  if (session.timeout) clearTimeout(session.timeout);
  session.timeout = setTimeout(() => {
    resetSession(session);
    console.log('Sessão expirada e resetada por inatividade.');
  }, 5 * 60 * 1000); // 5 minutos

  const nameMatch = message.match(/meu nome é ([a-zA-Z\s]+)/i);


  //verfifca se o nome foi informado
  if (nameMatch) {
    session.name = nameMatch[1].trim();
  }


  //adciona a mensagem do usuario
  session.messages.push({ role: 'user', content: message });

  const systemMessage: ChatMessage = {
    role: 'assistant',
    // Define o comportamento do bot
    content: `atenda de acordo com: ${protocoloAtendimento}`
  };

  const prompt: ChatMessage[] = [systemMessage];

  const missing = [];
  if (!session.name) missing.push('seu nome');


  if (missing.length > 0) {
    renovar(session);
    prompt.push(...session.messages);
    prompt.push({
      role: 'assistant',
      content: `Antes de prosseguir com seu atendimento, poderia me informar ${missing.join(' e ')}?`,
    });
    return prompt;
  }

  prompt.push({
    role: 'assistant',
    content: `Olá, ${session.name} ! Em que posso te ajudar hoje?`,
  });

  prompt.push(...session.messages);

  return prompt;
}
