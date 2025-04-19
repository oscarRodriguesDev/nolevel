'use client'
import ECommerce from "@/components/dashComponents/Dashboard/E-commerce";
import DefaultLayout from "@/components/dashComponents/Layouts/DefaultLaout";
import React from "react";

export default function HomeDashboard() {
  return (
    <>
    <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}
