'use client';

import { useState, useEffect } from 'react';

export default function ChatWidget() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [firstInteraction, setFirstInteraction] = useState(false); // Marca a primeira interação
  const [countdown, setCountdown] = useState<number | null>(null); // Armazena o tempo de contagem regressiva

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Adiciona a mensagem do usuário ao histórico
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Se for a primeira interação e o usuário não mandou uma saudação, envia a resposta diretamente
    if (firstInteraction || input.toLowerCase().includes('oi') || input.toLowerCase().includes('olá')) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        });

        const data = await res.json();
        const botMessage = { role: 'assistant', content: data.response };
        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Envia a saudação apenas se for a primeira interação e não tiver sido detectada uma saudação
      setLoading(true); // Deixa o chat "digitando" enquanto aguarda o tempo aleatório

      const randomDelay = Math.floor(Math.random() * 10000); // Tempo aleatório entre 0 e 10 segundos

      // Define o contador regressivo de 5 segundos antes de enviar a mensagem automática
      const delayBeforeTyping = randomDelay - 5000; // 5 segundos antes da resposta

      if (delayBeforeTyping > 0) {
        setCountdown(delayBeforeTyping / 1000); // Tempo em segundos
        setLoading(false); // Não "digitando" imediatamente
      }

      // Usamos setTimeout para simular o atraso
      setTimeout(() => {
        const welcomeMessage = {
          role: 'assistant',
          content: 'Oi, meu nome é Hevelyn e vou iniciar seu atendimento, tudo bem? como posso ajudar? ',
        };

        // Após o tempo aleatório, envia a mensagem
        setMessages((prev) => [...prev]);
        setFirstInteraction(true); // Marca que a primeira interação ocorreu
        setLoading(false);
      }, randomDelay); // Atraso antes de enviar a saudação
    }
  };

  useEffect(() => {
    // Caso o contador esteja ativo, atualiza a contagem regressiva a cada segundo
    if (countdown !== null && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer); // Limpa o timer quando o componente é desmontado ou a contagem termina
    }

    // Quando faltar 5 segundos para enviar a mensagem, começa a mostrar "digitando..."
    if (countdown === 5) {
      setLoading(true);
    }
  }, [countdown]);

  return (
    <div className="max-w-md w-full mx-auto p-6 rounded-2xl shadow-xl bg-white space-y-5 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800">🤖 Atendimento Virtual</h2>

      <div className="h-72 overflow-y-auto border rounded-xl bg-gray-100 p-4 space-y-3 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] px-4 py-2 text-sm rounded-2xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-300 text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-400 text-left italic">Digitando...</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Digite sua dúvida..."
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl text-sm font-medium"
          onClick={sendMessage}
          disabled={loading}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
