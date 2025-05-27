import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AssistantLayout } from "@/features/assistant/components/layout/assistant-layout"
import { PatientMedicalRecord } from "@/features/assistant/components/patients/medical-record/patient-medical-record"
import { Suspense } from "react"

export default function PatientMedicalRecordPage({ params }: { params: { id: string } }) {
  return (
    <AssistantLayout>
      <div className="container mx-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <PatientMedicalRecord patientId={params.id} />
        </Suspense>
      </div>
    </AssistantLayout>
  )
}
