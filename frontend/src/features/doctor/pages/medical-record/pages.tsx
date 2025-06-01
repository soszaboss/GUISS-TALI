import MedicalPatientRecord from "@/components/medical-record/medical-patient-record";
import { DoctorMedicalLayout } from "../../components/layouts/doctor-medical-layout";

export default function MedicalRecord(){
    return (
        <DoctorMedicalLayout>
            <MedicalPatientRecord />
        </DoctorMedicalLayout>
    )
}