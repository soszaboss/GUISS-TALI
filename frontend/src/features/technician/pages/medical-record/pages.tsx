import MedicalPatientRecord from "@/components/medical-record/medical-patient-record";
import { TechnicianLayout } from "../../components/layouts/technician-layout";

export default function MedicalRecord(){
    return (
        <TechnicianLayout>
            <MedicalPatientRecord />
        </TechnicianLayout>
    )
}