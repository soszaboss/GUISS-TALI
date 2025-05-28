import { Outlet } from "react-router-dom";
import { AssistantLayout } from "../../components/layout/assistant-layout";


export default function PatientsPage() {
  return (
    <AssistantLayout>
      <Outlet />
    </AssistantLayout>
  )
}
