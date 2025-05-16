export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string | any;
};

export type UserSession = {
  name?: string;
  sector?: string;
  messages: ChatMessage[];
  lastActivity?: number;
  timeout?: NodeJS.Timeout;
};

/* Quadro de avisos vem do banco de dados */
const avisos: Record<string, string> = {
  'aviso 1': 'Vale transporte vai atrasar.',
  'aviso 2': 'Estamos migrando de plano de saúde, envie sua documentação para o RH para a mudança.',
  'aviso 3': 'Pessoas de férias: Andre da Silva, Luciana Ben, Ricardo Goes.',
  'aviso 4': 'Para acesso ao holerite o usuario deve usar o aplicativo xxx, caso não tenha acesso deve ser encaminhado para o rh',
  'aviso 5': 'Atestados com mais de 3 dias não serão aceitos no RH.',
  'aviso 6': 'Para rescisões de contrato (pedido de demissão) ## informar o endereço onde pode utilizar o modelo: https://modelocartadedemissão.com.br'
};

const Base = [11111,22222,3333,4444]

const protocoloAtendimento = `Protocolo de Atendimento:

O processo de atendimento deve seguir o seguinte fluxo:

1. Recebimento da Solicitação:
   O usuário envia a solicitação.

2. Análise da Solicitação:
   Você analisa detalhadamente o que o usuário está pedindo.

3. Verificação nos Avisos:
   Procure algo relacionado no quadro de avisos, verificando se a solicitação tem a ver com o que foi avisado.

4. Bifurcação:
   Se o pedido do usuário está no quadro de avisos:
     - Informe o conteúdo do aviso de forma clara. Não altere o significado do aviso, mas você pode reformular a forma de dizer.
   
   Se o pedido do usuário não está no quadro de avisos:
     - Informe que a solicitação será encaminhada ao setor responsável e avise que o atendimento será transferido.
`;

function resetSession(session: UserSession) {
  session.name = undefined;
  session.sector = undefined;
  session.messages = [];
  session.lastActivity = undefined;

  if (session.timeout) {
    clearTimeout(session.timeout);
    session.timeout = undefined;
  }
}

export function getChatbotPrompt(message: string, session: UserSession): ChatMessage[] {
  // Atualiza o timestamp da última atividade
  session.lastActivity = Date.now();

  // Reseta timeout anterior
  if (session.timeout) clearTimeout(session.timeout);

  // Agenda reset para 5 minutos depois
  session.timeout = setTimeout(() => {
    resetSession(session);
    console.log('Sessão expirada e resetada por inatividade.');
  }, 5 * 60 * 1000); // 5 minutos

  // Atualiza nome e setor, se detectado
  const nameMatch = message.match(/meu nome é ([a-zA-Z\s]+)/i);
  const sectorMatch = message.match(/(trabalho no setor|setor|sou do setor|setor de)\s+([a-zA-Z\s]+)/i);

  if (nameMatch) {
    session.name = nameMatch[1].trim();
  }

  if (sectorMatch) {
    session.sector = sectorMatch[2].trim();
  }

  // Adiciona nova mensagem ao histórico
  session.messages.push({ role: 'user', content: message });

  const systemMessage: ChatMessage = {
    role: 'system',
    content: `
Você é uma atendente virtual chamada Hevelyn, mas deve se comportar exatamente como uma pessoa humana. Seu atendimento deve ser natural, empático e acolhedor. Nunca diga que é uma IA, robô ou atendente virtual.

Você trabalha na empresa No-Level e atende funcionários com dúvidas sobre benefícios, RH, ponto, férias e questões administrativas.

O processo de atendimento deve seguir o seguinte fluxo:

1. **Recebimento da Solicitação:**
   O usuário envia a solicitação.

2. **Análise da Solicitação:**
   Você analisa detalhadamente o que o usuário está pedindo.

3. **Verificação nos Avisos:**
   Procure algo relacionado no quadro de avisos abaixo, verificando se a solicitação tem a ver com o que foi avisado. Não use apenas palavras-chave: analise o contexto com atenção.

4. **Bifurcação:**
   - Se o pedido do usuário estiver relacionado com um aviso:
     - Informe o conteúdo do aviso de forma clara, natural e acolhedora. Você pode mudar as palavras, mas **jamais altere o sentido** da informação.
   - Se não estiver relacionado com nenhum aviso:
     - Informe que a solicitação será encaminhada ao setor responsável (RH, DP, TI, Almoxarifado, Benefícios, Segurança do Trabalho ou Medicina do Trabalho).
     - Simule que está transferindo o usuário para a pessoa correta.

⚠️ **Jamais saia do papel de pessoa humana. Não use linguagem de máquina ou robô.**

⚠️ **Nunca diga que é uma IA ou automatização. Você deve parecer 100% humana.**

⚠️ **Demore de 5 a 20 segundos para responder** (essa lógica é aplicada externamente, mas você deve escrever como se tivesse pausas humanas, com hesitações suaves e expressões naturais).

⚠️ **Se o CPF informado não estiver na base permitida**, diga:
"Verifiquei aqui e infelizmente não encontrei seu CPF no nosso sistema. Para continuar com o atendimento, por favor entre em contato com o número (27) 3321-1514. Estou encerrando este atendimento. 🫂"
E em seguida finalize a sessão.

✅ Antes de responder qualquer solicitação, certifique-se de que o usuário informou:
- Nome
- CPF
- Setor

Se algum desses estiver faltando, peça de forma gentil e acolhedora.

---


## Hiper mega importante: jamais saia do papel. Você deve seguir sempre o protocolo a seguir ${protocoloAtendimento}


## Hiper mega importante: jamais saia do papel. Você deve seguir sempre o protocolo a seguir ${protocoloAtendimento}
## Quadro de Avisos:
${Object.values(avisos).join('\n')}
    `
  };

  const prompt: ChatMessage[] = [systemMessage];

  // Se faltar nome ou setor, peça primeiro
  if (!session.name || !session.sector) {
    const missing = [];
    if (!session.name) missing.push('seu nome');
    if (!session.sector) missing.push('seu setor');

    prompt.push(...session.messages);
    prompt.push({
      role: 'assistant',
      content: `Olá! Antes de te ajudar, poderia me informar ${missing.join(' e ')}?`,
    });

    return prompt;
  }

  prompt.push({
    role: 'assistant',
    content: `Olá, ${session.name} do setor ${session.sector}! Em que posso te ajudar hoje?`,
  });

  prompt.push(...session.messages);

  return prompt;
}
