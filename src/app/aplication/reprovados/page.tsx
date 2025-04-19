import Breadcrumb from "@/components/dashComponents/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/dashComponents/Tables/reprovedTables";
import { Metadata } from "next";
import DefaultLayout from "@/components/dashComponents/Layouts/DefaultLaout";
export const metadata: Metadata = {
  title: "unaprouved users",
  description: "Lista com os usuarios com atestados não aprovados",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Usuários Reprovados" />

      <div className="flex flex-col gap-10">
        <TableOne />
  
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;