"use client";
import { useEffect, useState } from "react";
import { GrDocumentImage } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import {
  getAuthStatus,
  updateAprove,
  notificar,
  updateData
} from "@/app/(auth)/auth/authEmail";
import { Toaster, toast } from "sonner";

interface dataProps {
  CPF: string;
  nome: string;
  empresa: string;
  contrato: string;
  url: string;
  ultima_data: string;
  aprove: string;
  userID: string;
}

export const fetchData = async (): Promise<dataProps[]> => {
  const baseUrl = window.location.origin;
const apiUrl = `${baseUrl}/api/atestados`;
  const response = await fetch(`${apiUrl}`);
  if (!response.ok) {
    throw new Error(`Não foi possível recuperar dados`);
  }

  const data = await response.json();
  const result: dataProps[] = [];

  const sendSesmtData = data.sendSesmtData;
  for (const key in sendSesmtData) {
    if (sendSesmtData.hasOwnProperty(key) && key !== "atestados") {
      const parsedData: dataProps = JSON.parse(sendSesmtData[key]);
      parsedData.CPF = key;

      // Filtra apenas os dados reprovados
      if (parsedData.aprove === "reprovado") {
        result.push(parsedData);
      }
    }
  }

  return result;
};

const TableOne = () => {
  const [data, setData] = useState<dataProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [aprovado, setAprovado] = useState<string>();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const authStatus = await getAuthStatus();
        if (authStatus.loggedIn === true) {
          const fetchedData = await fetchData();
          setData(fetchedData); // Define os dados obtidos do backend no estado local
        } else {
          throw new Error("Usuário não está logado");
        }
      } catch (error) {
        console.log(error);
        setError("Não foi possível carregar os dados");
      } finally {
        setLoading(false); // Finaliza o carregamento, independentemente do resultado
      }
    };

    checkAuthAndFetchData(); // Chama a função para buscar os dados no início
  }, []);



  const handleButtonClick = async (cpf: string, aprove: string) => {
    try {
      await updateAprove(cpf, aprove); // Assumindo que updateData é uma função assíncrona

      // Atualiza o estado `data` após a atualização bem-sucedida
      const updatedData = data.map((item) => {
        if (item.CPF === cpf) {
          notificar(cpf, aprove);
          return { ...item, aprove };
        }
        setAprovado(item.aprove);
        return item;
      });
      setData(updatedData);
      toast.success(
        `Atestado de ${cpf} ${aprove === "aprovado" ? "aprovado" : "reprovado"}`
      );
    } catch (error) {
      console.log(`Erro ao atualizar dados: ${error}`);
      // Lida com erro de atualização, se necessário
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  /* Função utilizada para limpar o status de aprovação do usuario */
  async function cleanAprove(cpf: string) {
    try {
      await updateAprove(cpf, "");
      await updateData(cpf)
      toast.success("Usuario deletado com sucesso!");
      window.location.href = "/aplication/reprovados";
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro ao tentar deletar o usuario");
    }
  }
  

  return (
    <div className="rounded-[10px] bg-white px-2 pb-2 pt-2 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <Toaster />
      <div className="bg-slate-50 flex flex-col rounded-lg">
        <div className="grid grid-cols-7 gap-1">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-black">
              CPF
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-black">
              Nome
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-black">
              Empresa
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-black">
              Contrato
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-black">
              DOC
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-black">
              Data
            </h5>
          </div>
         
          <div className="px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-black">
              DEL
            </h5>
          </div>
        </div>

        {data.map((item, key) => (
          <div
            className={`grid grid-cols-7 gap-1 ${
              key === data.length - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <div className="flex items-center justify-center px-2 py-4">
                <p className="font-medium dark:text-slate-900">{item.CPF}</p>
              </div>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark">{item.nome}</p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark">{item.empresa}</p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark">{item.contrato}</p>
            </div>
            <div className="flex items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark">
                <a href={item.url} target="_blank">
                 <GrDocumentImage color='#ff0000' size={24}  /> 
                </a>
              </p>
            </div>
            <div className="flex items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark">{item.ultima_data}</p>
            </div>

        
            <div className="flex items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark">
                <MdDelete
                 className="cursor-pointer"
                  size={24}
                  onClick={() => {
                    cleanAprove(item.CPF);
                  }}
                />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
