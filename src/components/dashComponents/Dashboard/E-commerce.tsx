"use client";
import React from "react";
import TableOne from "../Tables/allUsers";
import { useState, useEffect } from "react";
import { getAuthStatus } from "@/app/(auth)/auth/authEmail";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

const ECommerce: React.FC = () => {
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const session = await getAuthStatus();
        setLogado(session.loggedIn);
      } catch (error) {
        setLogado(false);
      }
    };
    checkAuthStatus(); 
  }, []);
  return (
    <div>
      {logado ? (
     
        <div>
          <Breadcrumb pageName="Todos os Atestados" />
          <TableOne />
          <div className="col-span-12 xl:col-span-8"></div>
        </div>
     
      ) : (
        <div>
          <h1>No user Logged</h1>
        </div>
      )}
    </div>
  );
};

export default ECommerce;
