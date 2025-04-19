import Breadcrumb from "@/components/dashComponents/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/dashComponents/Tables/AprovTables";
import { Metadata } from "next";
import DefaultLayout from "@/components/dashComponents/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Usuários Reprovados",
  description: "Lista de usuários com atestados aprovados",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Approved Doc" />

      <div className="flex flex-col gap-10">
        <TableOne />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage; 