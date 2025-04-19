import Breadcrumb from "@/components/dashComponents/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/dashComponents/Tables/allUsers";
import { Metadata } from "next";
import DefaultLayout from "@/components/dashComponents/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "All Users",
  description: "Pagina listando todos os usuários ativos no banco de dados de usuarios",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Usuários Ativos" />
      <div className="flex flex-col gap-10">
        <TableOne />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
