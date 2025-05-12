"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  PhoneCall,
  Twitter,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Typewriter from "typewriter-effect";
import { cn } from "@/utils/utils";
import { usePathname } from "next/navigation";
import ChatWidget from "@/components/chat";


export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const constantClassName =
    "flex font-medium cursor-pointer bg-clip-text hover:text-purple-500 transition-colors duration-300";

  const pathname = usePathname();

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-white flex relative flex-col bg-bkg text-black overflow-hidden">
      <div
        className="absolute w-[200px] h-[150px] md:h-[200px] top-[120px] bg-cpurple
      rounded-full md:left-[240px] 2xl:left-[700px] custom-blur z-0 "
      />
      <div
        className=" hidden md:flex
      absolute w-[200px] h-[200px] top-[240px] bg-cpurple
      right-[40px] 2xl:right-[340px] custom-blur2 z-50 "
      />

      {/* secton 1 header*/}
      <section className="2xl:mx-[300px] z-[100] className='divide-black' ">
        <div className="flex lg:mt-[20px] mt-[10px] lg:mb-[20px] mb-[10px] lg:mx-[60px] xl:mx-[100px] 2xl:mx-[200px] mx-[30px] justify-between items-center overflow-hidden z-50">
          <div className="lg:text-[36px] md:text-[24px] sm:text-[15px] font-bold clash-display">
            <Image
              src="/images/home.png"
              alt="title of page"
              width={400}
              height={300}
            />
          </div>

          <div className="hidden items-center gap-x-10 xl:gap-x-24 md:flex">
            <div className="flex items-center md:gap-x-3 lg:gap-x-8 xl:gap-x-12">
              <div className={cn("lg:text-[16px] md:text-sm")}> <Link href='#about'>About</Link></div>
              <div className={cn("lg:text-[16px] md:text-sm")}> <Link href='#services'>Services</Link></div>
              <div className={cn("lg:text-[16px] md:text-sm")}> <Link href='#prices'>Prices</Link></div>
              <Link href="/">
                <div
                  className={cn(
                    constantClassName,
                    pathname == "/contact" ? "text-transparent" : ""
                  )}
                >
                  Contato
                </div>
              </Link>
            </div>
            <div>
              <Link href="/login">Entrar</Link>
            </div>
          </div>
          {isOpen && (
            <div
              className="absolute z-50 rounded-[8px] w-[60vw] md:w-3/4 bg-bkg overflow-hidden
        right-6 top-6 text-[14px] shadow-lg"
            >
              teste
            </div>
          )}
        </div>

        <hr />
      </section>

      {/* Section 2 Hero*/}
      <section className="mx-[300px] bg-white py-12">
        <div className="flex-col">
          <div className="flex text-[12px] md:text-[18px] justify-center md:text-end md:justify-end mt-[20px] md:mr-[25px] lg:mr-[60px] lg:text-[24px] font-bold">
            <i className="z-40">
              {" "}
              <Typewriter
                options={{
                  loop: true,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString(
                      "A comunicação é a chave do sucesso de qualquer organização."
                    )
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString(
                      "Transforme sua empresa e alcance novos patamares de eficiência."
                    )
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString(
                      "Não perca tempo! Agora é o momento de brilhar e ser líder de mercado."
                    )
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString(
                      "O No-Level encurta caminhos, otimiza o tempo de resposta e acelera o seu sucesso."
                    )
                    .pauseFor(1000)
                    .deleteAll()
                    .start();
                }}
              />
            </i>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col items-center md:items-start md:ml-[30px] lg:ml-[60px] xl:ml-[100px] 2xl:ml-[200px] leading-tight z-40">
              <div className="mt-17">
                <Link href="/" className="cursor-pointer mt-13 text-lg">
                  <h1 className="flex items-center text-4xl">
                    <span className="font-bold">No-</span>
                    <span className="text-purple-600 font-bold">Level</span>
                  </h1>
                </Link>
              </div>
              <div className="flex max-w-[250px] md:max-w-[360px] lg:max-w-[430px] leading-normal mb-[20px]">
                <p className="md:font-semibold text-center md:text-start text-[15px] lg:text-[16px]">
                  Conectando sua empresa de ponta a ponta
                </p>
              </div>
              <div>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
                  Saiba Mais
                </button>
              </div>
            </div>
            <div className="flex-grow mr-[2px] z-0">
              <Image
                src="/hackathonGuy2.png"
                alt="menu"
                width={700}
                height={563}
                draggable={false}
                className="hidden md:flex float-right z-0"
              />
              <Image
                src="/hackathonGuy.png"
                alt="menu"
                width={500}
                height={363}
                draggable={false}
                className="md:hidden flex float-right z-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* section 3  introduction*/}
      <section id='about' className="mx-[300px] bg-white py-12">
        <div className="flex flex-col md:flex-row mx-4 lg:mx-8 xl:mx-16 2xl:mx-32 my-4 md:my-8 gap-x-8 md:gap-x-16">
          <div className="flex my-auto z-50">
            <h2 className="text-6xl font-bold text-purple-700">No-Level</h2>
          </div>

          <div className="flex flex-col mt-4 md:my-auto z-50">
            <div className="flex flex-col text-lg md:text-2xl lg:text-3xl leading-normal clash-display">
              <h2 className="font-bold text-center md:text-left">
                Seja Bem vindo ao No-Level
              </h2>
            </div>

            <div className="mt-4 leading-loose max-w-2xl text-sm md:text-base lg:text-lg text-center md:text-left">
              O No-Level é um sistema inovador que conecta todos os colaboradores
              de sua empresa, otimizando o tempo de resposta a chamados e
              solicitações. Com o No-Level, qualquer barreira na comunicação entre
              colaboradores e o setor administrativo é eliminada, permitindo um
              fluxo de informações eficiente e ágil.
            </div>
          </div>
        </div>
      </section>

      {/* section 4 services and funcionalities*/}
      <section id='services' className="mx-[300px] bg-white py-12">
        <div className="flex flex-col md:flex-row-reverse mx-4 lg:mx-8 xl:mx-16 2xl:mx-32 my-4 md:my-8 gap-x-8 md:gap-x-16">
          <div className="flex my-auto z-50">
            <Image
              src="/services.png"
              alt="menu"
              width={768}
              height={1000}
              draggable={false}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Background elements */}
          <div className="hidden md:flex absolute w-250 h-200 md:h-200 bg-purple-700 rounded-full left-120 top-7 md:left-auto md:right-190 md:top-250 z-0 blur-custom"></div>
          <div className="absolute w-250 h-200 md:h-200 bg-purple-700 right-8 md:right-auto md:left-700 top-250 z-0 blur-custom"></div>

          <div className="flex flex-col mt-4 md:my-auto z-50">
            <div className="flex flex-col text-lg md:text-2xl lg:text-3xl leading-normal clash-display">
              <h2 className="font-bold text-center md:text-left">Principais</h2>
              <h2 className="font-bold text-center md:text-left text-pink-500">
                Funcionalidades
              </h2>
            </div>

            <div className="mt-4 leading-loose max-w-2xl text-sm md:text-base lg:text-lg text-center md:text-left">
              <ul>
                <li>
                  <strong>Envio de Atestados:</strong> Facilita o envio de
                  documentos médicos, garantindo agilidade na comunicação e na
                  resposta.
                </li>
                <li>
                  <strong>Solicitações de Férias:</strong> Simplifica o processo
                  de solicitação de férias, tornando-o mais transparente e
                  eficiente.
                </li>
                <li>
                  <strong>Gestão de Reclamações:</strong> Centraliza e organiza
                  todas as reclamações dos colaboradores, assegurando que sejam
                  tratadas de forma rápida e eficaz.
                </li>
                <li>
                  <strong>Acesso Facilitado:</strong> Proporciona acesso direto
                  aos setores responsáveis por solucionar problemas,
                  independentemente da localização do colaborador.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* section 5 important points */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 flex justify-center flex-col md:flex-row items-center md:items-start md:justify-center p-8">
          <div className="mb-8 md:mb-0 md:mr-8 w-full md:w-1/2 flex flex-col">
            <Image
              src="/important_points.png"
              alt="menu"
              width={700}
              height={600}
              draggable="false"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
            <h2 className="text-3xl font-bold text-purple-700 mb-4">
              No-Level Admin Eficiência e Rapidez
            </h2>
            <div className="text-gray-700">
              <div className="mb-4">
                <span className="font-semibold">
                  O painel No-Level Admin&nbsp;
                </span>{" "}
                é projetado para que os responsáveis pela administração possam
                gerenciar todos os chamados e solicitações de maneira rápida e
                eficiente. Com uma interface intuitiva e funcionalidades
                avançadas, o painel facilita a visualização e o tratamento de
                todas as demandas dos colaboradores.
              </div>
              <div className="mb-4">
                <span className="font-semibold">
                  Visualização Centralizada:&nbsp;
                </span>{" "}
                Todos os chamados e solicitações são exibidos em um painel
                único, permitindo uma visão abrangente e detalhada das demandas.
              </div>
              <div className="mb-4">
                <span className="font-semibold">
                  Priorização de Chamados:&nbsp;
                </span>{" "}
                Os administradores podem priorizar chamados com base na urgência
                e importância, garantindo que as solicitações críticas sejam
                tratadas primeiro.
              </div>
              <div className="mb-4">
                <span className="font-semibold">
                  Rastreamento de Status:&nbsp;
                </span>{" "}
                Permite acompanhar o progresso de cada chamado, desde a abertura
                até a resolução, proporcionando transparência e controle total
                do fluxo de trabalho.
              </div>
              <div className="mb-4">
                <span className="font-semibold">
                  Relatórios e Análises:&nbsp;
                </span>{" "}
                Gera relatórios detalhados sobre o desempenho do atendimento,
                identificando áreas para melhorias e garantindo um serviço
                contínuo e de alta qualidade.
              </div>
              <div className="flex justify-center mt-6">
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* section 6 plans and prices*/}
      <section id='prices' className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-purple-800">
            Planos e Preços
          </h2>
          <div className="flex flex-wrap -mx-4">
            {/* Plano Basic */}
            <div className="w-full md:w-1/2 px-4 mb-8">
              <div className="bg-purple-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Plano Basic
                </h3>
                <p className="text-gray-200 mb-4">
                  Assinatura ideal para pequenas equipes que buscam eficiência e
                  organização.
                </p>
                <div className="text-white text-3xl font-bold mb-4">
                  R$ 99,90/mês
                </div>
                <ul className="text-gray-300">
                  <li className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 fill-current mr-2"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    25 dispositivos **
                  </li>
                  <li className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 fill-current mr-2"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    03 Usuários Admins
                  </li>
                  <li className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 fill-current mr-2"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    1GB de Armazenamento em Nuvem
                  </li>
                </ul>
                <button className="mt-6 bg-green-700 hover:bg-green-400 text-white py-2 px-4 rounded-lg block w-full">
                  Escolher Plano
                </button>
                <p className="text-body-xs text-white">
                  ** Cobrança de R$1,00 por dispositivo excedente
                </p>
              </div>
            </div>

            {/* Plano Premium */}
            <div className="w-full md:w-1/2 px-4 mb-8">
              <div
                className="bg-purple-800 rounded-lg p-6 shadow-lg"
                style={{ boxShadow: "0 0 15px rgba(255, 215, 0, 0.7)" }}
              >
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Plano Premium
                </h3>
                <p className="text-gray-200 mb-4">
                  Assinatura ideal para grandes equipes que buscam máxima
                  eficiência e recursos avançados.
                </p>
                <div className="text-white text-3xl font-bold mb-4">
                  R$ 259,90/mês
                </div>
                <ul className="text-gray-300">
                  <li className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 fill-current mr-2"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    15 Usuários Admins 100 Dispositivos
                  </li>
                  <li className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 fill-current mr-2"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    100 Dispositivos**
                  </li>
                  <li className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 fill-current mr-2"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    5GB de Armazenamento em Nuvem
                  </li>
                </ul>
                <button className="mt-6 bg-green-700 hover:bg-green-400 text-white py-2 px-4 rounded-lg block w-full">
                  Escolher Plano
                </button>
                <p className="text-body-xs text-white">
                  ** Cobrança de R$1,00 por dispositivo excedente
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* chat para interagirn com chat bot */}

      <section>
       <ChatWidget/>
      </section>



      {/* section 7 footer */}
      <section className="bg-purple-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-y-0 gap-x-4">
            {/* Seção do Logo e Texto */}
            <div className="col-span-1 md:col-span-2">
              <div className="text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <Link href="/">
                    <span>No-</span>
                    <span className="text-pink-500">Level</span>
                  </Link>
                </h2>
                <p className="text-gray-300">
                  O No-Level transforma a comunicação dentro da sua empresa, otimizando processos e
                  conectando colaboradores de maneira rápida e eficiente. Com o No-Level, cada interação é
                  mais clara, ágil e eficaz. Descubra como nosso produto pode levar sua organização a novos
                  patamares de excelência.
                </p>
              </div>
              <div className="mt-6">
                <div className="flex space-x-4">
                  <div className="cursor-pointer text-gray-300 hover:text-pink-500 transition">
                    <span>Termos de uso</span>
                  </div>
                  <div className="cursor-pointer text-gray-300 hover:text-pink-500 transition">
                    <span>Politicas de Privacidade</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Links Úteis */}
            <div className="col-span-1">
              <div className="text-white">
                <h3 className="text-lg font-semibold text-pink-500 mb-2">
                  Links úteis
                </h3>
                <div className="flex flex-col space-y-2">
                  <div className="cursor-pointer text-gray-300 hover:text-pink-500 transition">
                    <span>About Us</span>
                  </div>
                  <div className="cursor-pointer text-gray-300 hover:text-pink-500 transition">
                    <span>Services</span>
                  </div>
                  <div className="cursor-pointer text-gray-300 hover:text-pink-500 transition">
                    <span>Prices</span>
                  </div>
                  <div className="cursor-pointer text-gray-300 hover:text-pink-500 transition">
                    <span>Contato</span>
                  </div>
                </div>
                <div className="flex items-center mt-4 space-x-4">
                  <span className="text-pink-500 text-sm">Siga-nos:</span>
                  <div className="flex space-x-2">
                    <div className="cursor-pointer text-gray-300 hover:text-pink-500 transition">
                      <Instagram className="h-6 w-6" />
                    </div>
                    <div className="cursor-pointer text-gray-300 hover:text-pink-500 transition">
                      <Twitter className="h-6 w-6" />
                    </div>
                    <div className="cursor-pointer text-gray-300 hover:text-pink-500 transition">
                      <Facebook className="h-6 w-6" />
                    </div>
                    <div className="cursor-pointer text-gray-300 hover:text-pink-500 transition">
                      <Linkedin className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Contato */}
            <div className="col-span-1">
              <div className="text-white">
                <h3 className="text-lg font-semibold text-pink-500 mb-2">
                  Falar com um atendente
                </h3>
                <div className="flex items-center space-x-4">
                  <PhoneCall className="h-6 w-6" />
                  <span className="text-gray-300">+5527988991663</span>
                </div>
                <div className="flex items-center mt-4 space-x-4">
                  <MapPin className="h-6 w-6" />
                  <span className="text-gray-300">
                    Civit II n° 27 Serra ES
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Direitos Reservados */}
          <div className="flex justify-center items-center mt-8 text-white text-sm md:text-base lg:text-lg">
            Todos os direitos reservados. &copy; No-Level.com.br
          </div>
        </div>
      </section>


    </div>
  );
}
