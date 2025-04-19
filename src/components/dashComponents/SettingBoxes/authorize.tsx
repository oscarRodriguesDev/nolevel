"use client";
import React, { useState, ChangeEvent } from "react";
import { RiUploadCloudLine } from "react-icons/ri";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import {toast, Toaster} from 'sonner'

const Authorizations: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string[][] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      readFileContent(selectedFile);
    }
  };

  const readFileContent = (file: File): void => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonContent = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

        if (jsonContent.length === 0 || jsonContent[0].length !== 1 || jsonContent[0][0].toLowerCase() !== "cpfs autorizados") {
          setError("O arquivo deve ter 'cpfs autorizados' na célula A1 e apenas a coluna A utilizada.");
          setFile(null);
          setFileContent(null);
          return;
        }
               
        for (let i = 1; i < jsonContent.length; i++) {
            //!/^[\d.-]+$/.test(jsonContent[i][0]) 
          if (!/^[\d.-]+$/.test(jsonContent[i][0])) {
            setError("Toda a coluna A, a partir de A2 em diante, deve ser composta de números.");
            setFile(null);
            setFileContent(null);
            return;
          }
        }

        setFileContent(jsonContent);
      }
    };
    reader.onerror = (error) => {
      toast.error('Erro ao carregar o arquivo')
      console.error("File reading error:", error);
      setError("Erro ao ler o arquivo.");
    };
    reader.readAsArrayBuffer(file);
  };



  //função para autorizar novos usuarios a acessar o sistema
  const saveAuthorizedCPFsViaAPI = async (cpfs: string[]): Promise<void> => {
    const baseUrl = window.location.origin;
    const apiUrl = `${baseUrl}/api/authorization`;
    try {
      const response = await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpfs }),
      });

      if (!response.ok) {
        toast.error('Ocorreu um erro ao tentar salvar lista de CPFs! Tente novamente')
        throw new Error('Erro ao salvar CPFs autorizados via API.');
      
      }
        toast
      //console.log('CPFs autorizados salvos com sucesso via API.');
      toast.success('Lista de CPFs enviada com sucesso!')
      window.location.href = "/aplication/permissionUsers";
    } catch (error) {
      //console.error('Erro ao salvar CPFs autorizados via API:', error);
      throw new Error('Erro ao salvar CPFs autorizados via API.');
    }
  };


  
  const handleSaveCPFs = async () => {
    if (!fileContent) {
      setError("Nenhum arquivo carregado.");
      return;
    }

    try {
      const cpfs = fileContent.slice(1).map(row => row[0]);
      await saveAuthorizedCPFsViaAPI(cpfs);
      //console.log('CPFs salvos com sucesso');
      toast.success('CPFs salvos com sucesso')
    } catch (error) {
      console.error('Erro ao salvar CPFs:', error);
      setError('Erro ao salvar CPFs.');
    }
  };

  const handleCancel = (): void => {
    setFile(null);
    setFileContent(null);
    setError(null);
    window.location.href = "/aplication/permissionUsers";
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-8">
        {/* Left side: File upload */}
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Escolha seu arquivo de autorização de usuários
              </h3>
            </div>
            <div className="p-7">
              <form>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full">
                    <SiMicrosoftexcel size={50} />
                  </div>
                </div>

                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary sm:py-7.5"
                >
                  <input
                    type="file"
                    name="arquive"
                    id="profilePhoto"
                    accept=".xlsx,.csv"
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <span className="flex items-center justify-center rounded-full bg-white dark:border-dark-3 dark:bg-gray-dark">
                      <RiUploadCloudLine size={50} />
                    </span>
                    <p className="mt-1 text-body-xs">xlsx or CSV files</p>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs">{error}</p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex items-center justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                    type="button"
                    onClick={handleSaveCPFs}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right side: File display */}
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-7">
            <h1 className="font-medium text-dark dark:text-white mb-4">
              Apresentação do arquivo
            </h1>
            {file ? (
              <div>
                <h2 className="text-dark dark:text-white">Arquivo Enviado:</h2>
                <p className="text-body-xs">{file.name}</p>
                {fileContent && fileContent.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {fileContent[0].map((header, index) => (
                          <th
                            key={index}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {fileContent.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-body-xs text-gray-500 dark:text-gray-400">
                    Carregando conteúdo do arquivo...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-body-xs text-gray-500 dark:text-gray-400">
                Nenhum arquivo enviado.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Authorizations;
