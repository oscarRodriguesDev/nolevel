import Breadcrumb from "@/components/dashComponents/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/dashComponents/Layouts/DefaultLaout";
import SettingBoxes from "@/components/dashComponents/SettingBoxes";

export const metadata: Metadata = {
  title: "Next.js Settings Page | NextAdmin - Next.js Dashboard c",
  description: "This is Next.js Settings page for NextAdmin Dashboard Kit",
};

const Settings = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Settings" />
        <SettingBoxes />
      </div>
    </DefaultLayout>
  );
};

export default Settings;
