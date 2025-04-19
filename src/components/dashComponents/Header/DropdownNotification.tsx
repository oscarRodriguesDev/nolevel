"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ClickOutside from "../ClickOutside";
import { TbPointFilled } from "react-icons/tb";
import { LiaEnvelopeSolid } from "react-icons/lia";
import { updateAlert } from "@/app/(auth)/auth/authEmail"; // Deverá ser feito via API no futuro
import { Toaster, toast } from "sonner"; // Importação do componente de toast para feedback visual

type Notification = {
  cpf: string;
  title: string;
};

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para controlar a abertura/fechamento do dropdown
  const [notifying, setNotifying] = useState(true); // Estado para controlar se há notificações ativas
  const [listaNotif, setListaNotif] = useState<Notification[]>([]); // Estado para armazenar a lista de notificações
  const [count, setCount] = useState<number>(0); // Estado para armazenar a quantidade de novas notificações

  // Função assíncrona que busca as notificações ativas na API
  const getNotifications = async (): Promise<Notification[]> => {
    const baseUrl = window.location.origin;
    const apiUrl = `${baseUrl}/api/atestados`;
    const response = await fetch(`${apiUrl}`);
    if (!response.ok) {
      throw new Error(`Não foi possível recuperar dados`);
    }

    const data = await response.json();
    const result: Notification[] = [];

    const sendSesmtData = data.sendSesmtData;

    for (const cpf in sendSesmtData) {
      if (sendSesmtData.hasOwnProperty(cpf)) {
        const parsedData = JSON.parse(sendSesmtData[cpf]);

        // Verifica se há uma URL definida e se o alerta está ativado
        if (parsedData.url !== "" && parsedData.alert) {
          result.push({
            cpf,
            title: `${cpf} enviou um atestado`,
          });
        }
      }
    }

    return result;
  };

  // Função assíncrona para marcar uma notificação como lida e removê-la da lista
  const openNotify = async (cpf: string) => {
    try {
      await updateAlert(cpf, false); // Chamada à API para atualizar o alerta como lido
      setListaNotif((prev) => prev.filter((notif) => notif.cpf !== cpf)); // Remove a notificação da lista
      setCount((prev) => prev - 1); // Atualiza o contador de notificações
      setNotifying(false); // Define que não há mais notificações ativas para controlar o ícone de notificação
      toast.success('Você não verá mais essa notificação'); // Exibe um toast de sucesso ao usuário
    } catch (error) {
      console.error("Erro ao atualizar notificação:", error);
    }
  };

  // useEffect para buscar notificações ao montar o componente e a cada 30 segundos
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await getNotifications(); // Busca as notificações ativas na API
        setListaNotif(notifications); // Atualiza a lista de notificações
        setCount(notifications.length); // Atualiza o contador de notificações
        setNotifying(notifications.length > 0); // Define se há notificações ativas para controlar o ícone de notificação
      } catch (error) {
        console.error("Erro ao obter notificações:", error);
      }
    };

    fetchNotifications(); // Chama a função de busca de notificações ao montar o componente

    const interval = setInterval(fetchNotifications, 30000); // Intervalo para buscar novas notificações a cada 30 segundos

    // Cleanup da função de intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  return (
    <ClickOutside
      onClick={() => setDropdownOpen(false)}
      className="relative hidden sm:block"
    >
      <Toaster position="bottom-right" /> {/* Componente Toaster para exibir toasts de feedback */}

      <li>
        <Link
          onClick={() => {
            setDropdownOpen(!dropdownOpen); // Alterna o estado para abrir ou fechar o dropdown
          }}
          href="#"
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-stroke bg-gray-2 text-dark hover:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:hover:text-white"
        >
          <span className="relative">
            <LiaEnvelopeSolid size={24} /> {/* Ícone de envelope para notificações */}

            {notifying && ( // Renderização condicional do ícone de notificação com animação de ping
              <span className="absolute -top-0.5 right-0 z-1 h-2.5 w-2.5 rounded-full border-2 border-gray-2 bg-red-light dark:border-dark-3">
                <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-red-100 opacity-75"></span>
              </span>
            )}

            {count > 0 && ( // Exibe a contagem de notificações não lidas
              <h6 className="absolute top-5 right-0 left-2 text-xs text-red font-bold">{count}</h6>
            )}
          </span>
        </Link>

        {dropdownOpen && ( // Renderização do conteúdo do dropdown se estiver aberto
          <div
            className={`absolute -right-27 mt-7.5 flex h-[550px] w-75 flex-col rounded-xl border-[0.5px] border-stroke bg-white px-5.5 pb-5.5 pt-5 shadow-default dark:border-dark-3 dark:bg-gray-dark sm:right-0 sm:w-[364px]`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-medium text-dark dark:text-white">
                Alertas
              </h5>
              <span className="rounded-md bg-primary px-2 py-0.5 text-body-xs font-medium text-white">
                {count} novos alertas
              </span>
            </div>

            <ul className="no-scrollbar mb-5 flex h-auto flex-col gap-1 overflow-y-auto">
              {listaNotif.map((item, index) => (
                <li key={index}>
                  <div
                    className="flex items-center gap-4 rounded-[10px] p-2.5 hover:bg-gray-2 dark:hover:bg-dark-3 cursor-pointer"
                    onClick={() => openNotify(item.cpf)} // Ao clicar, marca a notificação como lida
                  >
                    <span className="block h-14 w-14 rounded-full">
                      <TbPointFilled size={24} color={"#ef5e48"} /> {/* Ícone para representar a notificação */}
                    </span>

                    <span className="block">
                      <span className="block font-medium text-sm text-dark dark:text-white">
                        {item.title}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              className="flex items-center justify-center rounded-[7px] border border-primary p-2.5 font-medium text-primary hover:bg-blue-light-5 dark:border-dark-4 dark:text-dark-6 dark:hover:border-primary dark:hover:bg-blue-light-3 dark:hover:text-primary"
              href="#"
            >
              Marcar todas como Lidas
            </Link>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
