import MedicalPatientsPage from "@/features/medical-record/page";
import { DoctorMedicalLayout } from "../../components/layouts/doctor-medical-layout";

export default function PatientsPage() {
    return (
        <DoctorMedicalLayout>
            <MedicalPatientsPage/>
        </DoctorMedicalLayout>
    )
}