import { AppointmentSchedulingPage } from "../../components/appointments/appointment-scheduling-page";
import { AssistantLayout } from "../../components/layout/assistant-layout";

export default function AppointmentsPage() {
  return (
    <AssistantLayout>
      <AppointmentSchedulingPage />
    </AssistantLayout>
  )
}
