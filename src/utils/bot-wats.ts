import qrcode from 'qrcode-terminal';
import {Buttons, List, MessageMedia, Chat, Contact } from 'whatsapp-web.js';

import { Client, LocalAuth } from 'whatsapp-web.js';

const client = new Client({
  authStrategy: new LocalAuth(), // isso salva a sessão automaticamente
  puppeteer: {
    headless: true, // ou false para ver o navegador
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});



// Gerar QR Code no terminal
client.on('qr', (qr: string) => {
  qrcode.generate(qr, { small: true });
});

// Confirmar que o WhatsApp foi conectado
client.on('ready', () => {
  console.log('Tudo certo! WhatsApp conectado.');
});

// Inicializar cliente
client.initialize();

// Função auxiliar para criar delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Escutar mensagens recebidas
client.on('message', async (msg) => {
  if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) && msg.from.endsWith('@c.us')) {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname || 'usuário';

    await delay(3000);
    await chat.sendStateTyping();
    await delay(3000);
    await client.sendMessage(
      msg.from,
      `Olá! ${name.split(' ')[0]}! Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Como funciona\n2 - Valores dos planos\n3 - Benefícios\n4 - Como aderir\n5 - Outras perguntas`
    );
  }
});