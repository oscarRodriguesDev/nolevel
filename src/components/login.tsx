"use client";
import { useState } from "react";
import { userLogin } from "@/app/(auth)/auth/authEmail";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import imageLogin from "../../public/images/home.png";
import Image from "next/image";

export function Login() {
  const [user, setUser] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const router = useRouter();

  async function logar(cpf: string, senha: string) {
    try {
      const res = await userLogin(cpf, senha);
      if (res) {
        router.push("aplication/all");
        toast.success("seja bem vindo!");
      } else {
        toast.error("Acesso não autorizado!");
      }
    } catch (error) {
      toast.error("Acesso não autorizado!");
    }
  }

  return (
    <div className=" min-h-svh  flex flex-col items-center   relative">
      <Toaster />
      <Image
        src={imageLogin}
        width={1000}
        height={800}
        alt="Login Image"
        className=" top-1 object-cover w-full h-full opacity-65"
      />
    <div className="bg-white bg-opacity-75 p-6 rounded-lg shadow-xl w-full max-w-md z-10">
  <h1 className="w-full bg-gradient-to-r from-sky-900 to-purple-900 text-body-title font-bold text-center mb-6 text-white rounded-t-lg py-4">
    LOGIN
  </h1>
  <form
    className="space-y-6"
    onSubmit={(e) => {
      e.preventDefault();
      logar(user, senha);
    }}
  >
    <div className="w-full flex flex-col justify-center">
      {/* <div className="relative w-full h-24 mb-6 bg-gray-200 rounded-lg flex items-center justify-center"></div> */}
      <input
        type="text"
        placeholder="CPF"
        required
        className="px-4 py-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        required
        className="px-4 py-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      >
        Login
      </button>
    </div>
  </form>
</div>

    </div>
  );
}
