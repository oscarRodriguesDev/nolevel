import DefaultLayout from "@/components/dashComponents/Layouts/DefaultLaout"
import EmissionCertifield from "@/components/dashComponents/SettingBoxes/emite"
import Breadcrumb from "@/components/dashComponents/Breadcrumbs/Breadcrumb"

export default function FormCertificate() {
    return (
        <DefaultLayout>
             <Breadcrumb pageName="Emissão de Atestado" />
            <div>
                <EmissionCertifield />

            </div>
        </DefaultLayout>
    )
}