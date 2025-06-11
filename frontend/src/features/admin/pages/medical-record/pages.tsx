import MedicalPatientRecord from "@/components/medical-record/MedicalPatientRecord";
import AdminLayout from "../../components/layouts/layout";

export default function MedicalRecord(){
    return (
        <AdminLayout>
            <MedicalPatientRecord />
        </AdminLayout>
    )
}