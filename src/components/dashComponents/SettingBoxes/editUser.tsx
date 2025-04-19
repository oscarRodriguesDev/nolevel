"use client";
import React from "react";
import { PiTextboxBold } from "react-icons/pi";
import { GoNumber } from "react-icons/go";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Toaster, toast } from "sonner";
import { useState,  useRef} from "react";


const SettingsUsers = () => {
  const [cpf, setCpf] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [empresa, setEmpresa] = useState<string>("");
  const [contrato, setContrato] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("text-black"); // Estado para a cor do texto
  const confirmRef = useRef<HTMLInputElement>(null);



   function clear(){
     setCpf('')
     setEmail('')
     setNome("")
     setEmail('')
     setSenha("")
     setConfirm("")
     setEmpresa("")
     setContrato("")
   }

//fução para validar cpf
function validateCPF(cpf:string) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11) return false;

  // Elimina CPFs conhecidos como inválidos
  const invalidCPFList = [
    '00000000000', '11111111111', '22222222222', '33333333333',
    '44444444444', '55555555555', '66666666666', '77777777777',
    '88888888888', '99999999999'
  ];
  if (invalidCPFList.includes(cpf)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== parseInt(cpf.charAt(10))) return false;

  return true;
}


//função para submenter o cadastro do usuario
async function handleSubmit() {
    if (!cpf || !email || !senha || !nome || !empresa || !contrato) {
      toast.error("campos vazios");
      return;
    }
  
    const data = {
      cpf: cpf,
      email: email,
      senha: senha,
      nome: nome,
      empresa: empresa,
      contrato: contrato,
    };
  
    try {
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/api/atestados`;
      const response = await fetch(`${apiUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        toast.success("cadastro realizado com sucesso");
        clear();
      
      } else {
        const error = await response.json();
        toast.error("Erro ao cadastrar: " + (error));
      }
    } catch (error) {
      toast.error("Erro ao cadastrar: " + error);
    }
  }
  
  
//função para pegar o valor da confirmação da senha
  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   
    setConfirm(e.target.value);
  };

  const handleConfirmBlur = () => {
 
    if (senha !== confirm) {
      toast.error("Senhas não conferem");
      setConfirm("");
      setTextColor("text-red-500");
    } else {
      setTextColor("text-black");
    }
    
  };


  //função para setar o valor do email de acordo com a regra do negócio
  function handleCPF(e: React.ChangeEvent<HTMLInputElement>) {
    setCpf(e.target.value);
    setEmail(`${e.target.value}@sender.com.br`);
  }


  //função para validar o cpf
  function blurCPF(e:React.FocusEvent<HTMLInputElement>){

    if(!validateCPF(e.target.value)){
      setCpf('')
      toast.error("O CPF informado é invalido!")
    }else{
      setCpf(e.target.value);
    }
    
   }

   //função para avaliar se a senha possui 8 letras
   function blurPass(e:React.FocusEvent<HTMLInputElement>){
     if(e.target.value.length<8){
      toast.error('Sua senha precisa ter no minimo 8 caracteres')
      setSenha('')
     }
   }

  return (
    <>
      <Toaster />
      <div className="container mx-auto px-4">
        <div className="w-full lg:w-2/3 mx-auto">
          <div className="rounded-xl border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-300 px-7 py-4 text-center dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white">
                User Settings
              </h3>
            </div>
            <div className="py-5 px-6">
              <form>
                {/* Campo de CPF */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CPF
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <GoNumber size={24} />
                    </span>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500"
                      type="text"
                      placeholder="00000000000"
                      value={cpf}
                      onBlur={(e)=>blurCPF(e)}
                      onChange={(e) => handleCPF(e)}
                    />
                  </div>
                </div>

                {/* Campo de Nome */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <PiTextboxBold size={24} />
                    </span>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500"
                      type="text"
                      placeholder="Nome do usuário"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                      }}
                    />
                  </div>
                </div>

                {/* Campo de Email */}
                <div className="mb-6">
                  <label
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    htmlFor="emailAddress"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <MdAlternateEmail size={24} />
                    </span>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500"
                      type="email"
                      name="emailAddress"
                      id="emailAddress"
                      placeholder="cpf@sender,com.br"
                      value={email}
                    />
                  </div>
                </div>

                {/* Campo de Senha */}
                <div className="mb-6">
                  <label
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    htmlFor="password"
                  >
                    Escolha uma senha forte
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <RiLockPasswordLine size={24} />
                    </span>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500"
                      type="password"
                      name="password"
                      id="password"
                      placeholder="*********"
                      value={senha}
                      onBlur={(e) => {blurPass(e)}}
                      onChange={(e) => {
                        setSenha(e.target.value);
                      }}
                    />
                  </div>
                </div>

                {/* Campo de Confirmação de Senha */}
                <div className="mb-6">
                  <label
                    className="mb-2 block text-sm font-medium   text-gray-700 dark:text-gray-300"
                    htmlFor="confirmPassword"
                  >
                    Confirme sua senha
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <RiLockPasswordLine size={24} />
                    </span>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white  py-2.5 pl-12 pr-4 focus:border-blue-500 focus:outline-none  dark:border-gray-700 dark:bg-gray-900 dark:focus:border-blue-500"
                      type="password"
                      placeholder='********'
                      value={confirm}
                      onChange={handleConfirmChange}
                      onBlur={handleConfirmBlur}
                    />
                  </div>
                </div>

                {/* Campo de Empresa */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Empresa
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-8 text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                    >
                      <option value="">Escolha</option>
                      <option value="Dikma">Dikma</option>
                      <option value="Caex">Caex</option>
                      <option value="Ecoplus">Ecoplus</option>
                      <option value="Dikmaq">Dikmaq</option>
                    </select>
                  </div>
                </div>

                {/* informe do nome do contrato */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contrato
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <PiTextboxBold size={24} />
                    </span>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500"
                      type="text"
                      placeholder="Digite o nome do contrato"
                      value={contrato}
                      onChange={(e) => setContrato(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  {/* Botão para cancelar */}
                  <button
                    className="flex justify-center rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-800 hover:shadow-md dark:border-gray-700 dark:text-white"
                    type="button"
                  >
                    Cancel
                  </button>

                  {/* Botão para salvar */}
                  <button
                    className="flex justify-center rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600"
                    type="button"
                    onClick={(e) => {
                      handleSubmit();
                    }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsUsers;
