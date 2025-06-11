import MedicalPatientRecord from "@/components/medical-record/MedicalPatientRecord";
import { DoctorMedicalLayout } from "../../components/layouts/doctor-medical-layout";

export default function MedicalRecord(){
    return (
        <DoctorMedicalLayout>
            <MedicalPatientRecord />
        </DoctorMedicalLayout>
    )
}