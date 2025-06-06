import MedicalPatientsPage from "@/features/medical-record/page";
import { TechnicianLayout } from "../../components/layouts/technician-layout";

export default function PatientsPage() {
    return (
        <TechnicianLayout>
            <MedicalPatientsPage/>
        </TechnicianLayout>
    )
}