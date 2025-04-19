"use client";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import {
  getAuthStatus,
  updateAprove,
  notificar,
  deleteUsuario,
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
      result.push(parsedData);
    }
  }

  return result;
};

const TableOne = () => {
  const [data, setData] = useState<dataProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userCPF, setUserCPF] = useState<string | any>();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const authStatus = await getAuthStatus();
        setUserCPF(authStatus.email?.slice(0, 11));
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  async function deleteUser(uid: string, cpf: string) {
    const baseUrl = window.location.origin;
    const apiUrl = `${baseUrl}/api/atestados`;
    try {
      const response = await fetch(
        `${apiUrl}/?id=${uid}&cpf=${cpf}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao tentar deletar usuário");
      }

      const data = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw new Error(`Erro ao deletar usuário: ${error}`);
    }
  }

  async function eraserUser(uid: string, cpf: string) {
    try {
      await deleteUser(uid, cpf);
      toast.success("Usuario deletado com sucesso!");
      window.location.href = "";
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro ao tentar deletar o usuario");
    }
  }

  return (
    <div className="rounded-[10px] bg-white px-2 pb-2 pt-2 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <Toaster />
      <div className="bg-slate-50 flex flex-col rounded-lg">
        <div className="grid grid-cols-4 gap-1">
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
              DEL
            </h5>
          </div>
        </div>

        {data.map((item, key) => (
          <div
            className={`grid grid-cols-4 gap-1 ${
              key === data.length - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
            }`}
            key={key}
          >
            <div className="flex items-center justify-center px-2 py-4">
              <p
                className={`font-medium ${
                  item.CPF === userCPF ? "text-red-500" : "text-dark"
                }`}
              >
                {item.nome}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p
                className={`font-medium ${
                  item.CPF === userCPF ? "text-red-500" : "text-dark"
                }`}
              >
                {item.empresa}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p
                className={`font-medium ${
                  item.CPF === userCPF ? "text-red-500" : "text-dark"
                }`}
              >
                {item.contrato}
              </p>
            </div>

            {item.CPF === userCPF ? (
              <div className="flex items-center justify-center px-2 py-4 sm:flex">
                <p className="font-medium text-dark">
                  <MdDelete
                   className="cursor-pointer"
                    size={24}
                    color="red"
                    onClick={() => {
                      toast.error("Impossivel apagar o proprio usuario");
                    }}
                  />
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center px-2 py-4 sm:flex">
                <p className="font-medium text-dark">
                  <MdDelete
                  className="cursor-pointer"
                    size={24}
                    onClick={() => {
                      eraserUser(item.userID, item.CPF);
                    }}
                  />
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
