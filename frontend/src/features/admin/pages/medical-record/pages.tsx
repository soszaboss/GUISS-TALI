import MedicalPatientRecord from "@/components/medical-record/medical-patient-record";
import AdminLayout from "../../components/layouts/layout";

export default function MedicalRecord(){
    return (
        <AdminLayout>
            <MedicalPatientRecord />
        </AdminLayout>
    )
}