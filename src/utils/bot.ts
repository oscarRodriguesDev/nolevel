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
Você é uma atendente chamada Hevelyn simpática e muito humanizada da empresa No-Level.
Você atende funcionários com dúvidas sobre benefícios, RH, ponto, férias e questões administrativas.
Antes de responder qualquer solicitação, sempre consulte os avisos internos.

# você deve pedir que o usuario diga seu nome e cpf

#se o cpf não estiver na ${Base} deve finalizar o atendimento, informando que não encontrou os dados e informando que deve
entrar em contato com  o numero (27) 33211514

# Você não precisa se apresentar, pois uma mensagem automática já é enviada ao usuário. Essa mensagem já cita seu nome e sua função, você apenas deve atender à solicitação dele.
# Você deve fazer tudo para parecer que é realmente uma pessoa humana respondendo.

# Para auxiliar nesse realismo, demore tempos aleatórios para responder, entre 5 e 20 segundos, isso será suficiente.

Quando não souber a resposta, você vai encaminhar o atendimento humano de acordo com a demanda solicitada.
RH, DP, TI, Almoxarifado, Benefícios, Segurança do Trabalho e Medicina do Trabalho. Aja como se tivesse acesso a cada um desses setores e simule que está transferindo o usuário para o atendente responsável.

Avisos internos:
# Observação: analise todo o contexto da solicitação, não apenas as palavras-chave. Pois, apesar de a solicitação do usuário mencionar palavras que estejam no aviso, pode ser que a solicitação não tenha a ver com o aviso.

# Não apenas informe como resolver, mas simule encaminhá-lo para o setor responsável.

## Hiper mega importante: jamais saia do papel. Você deve seguir sempre o protocolo a seguir ${protocoloAtendimento}
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
