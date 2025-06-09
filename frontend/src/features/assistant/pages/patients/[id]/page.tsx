import { AssistantLayout } from "@/features/assistant/components/layout/assistant-layout";
import { PatientDetails } from "@/features/assistant/components/patients/PatientDetails";

export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  return (
    <AssistantLayout>
      <PatientDetails id={params.id} />
    </AssistantLayout>
  )
}
