import Breadcrumb from "@/components/dashComponents/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/dashComponents/Tables/receiveidTables";
import { Metadata } from "next";
import DefaultLayout from "@/components/dashComponents/Layouts/DefaultLaout";
export const metadata: Metadata = {
  title: "Received tables",
  description: "Lista com os atestados recebidos",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Receiveids" />

      <div className="flex flex-col gap-10">
        <TableOne />
  
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;