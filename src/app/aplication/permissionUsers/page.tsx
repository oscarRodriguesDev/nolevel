import Breadcrumb from "@/components/dashComponents/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/dashComponents/Layouts/DefaultLaout";
import Authorizations from "@/components/dashComponents/SettingBoxes/authorize";
export const metadata: Metadata = {
  title: "Autorização para novos usuários",
  description: "Pagina para autorização de novos usuários",
};
export default function Permission(){
  return(
    <DefaultLayout>
    <Breadcrumb pageName="Autorização de usuários" />
     <Authorizations/>
  </DefaultLayout>
  )
}