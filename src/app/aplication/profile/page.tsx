import Breadcrumb from "@/components/dashComponents/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/dashComponents/Layouts/DefaultLaout";
import ProfileBox from "@/components/dashComponents/ProfileBox";

export const metadata: Metadata = {
  title: "Sender Admin",
  description: "Profile pages of sender admin",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />

        <ProfileBox />
      </div>
    </DefaultLayout>
  );
};
 export default Profile;

