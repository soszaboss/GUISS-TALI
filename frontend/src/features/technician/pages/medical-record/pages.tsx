import MedicalPatientRecord from "@/components/medical-record/MedicalPatientRecord";
import { TechnicianLayout } from "../../components/layouts/technician-layout";

export default function MedicalRecord(){
    return (
        <TechnicianLayout>
            <MedicalPatientRecord />
        </TechnicianLayout>
    )
}