"use client";
import { useState, useEffect } from "react";
import { getAuthStatus } from "../(auth)/auth/authEmail";
import HomeDashboard from "../aplication/page";
import { PageLogin } from "@/components/loginPage";

export default function Home() {
  const [estado, setEstado] = useState<boolean | null>(null);
  const [load,setLoad]= useState<boolean>(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const session = await getAuthStatus();
        setLoad(session.loggedIn)
        setEstado(session.loggedIn);
          if(!estado){
            setLoad(false);
          }else{
            setLoad(true);
          }
      } catch (error) {
        setEstado(false);
      }
    };

    checkAuthStatus();
  }, [estado]);

  return (
    <div>
      {!estado ? (
        <div className=" min-h-dvh  flex items-center justify-center bg-gradient-to-t from-blue-500 via-purple-600 to-blue-500">
          <PageLogin
          carregando={load}
          />
        </div>
      ) : (
        <div>
          <HomeDashboard />
        </div>
      )}
    </div>
  );
}
