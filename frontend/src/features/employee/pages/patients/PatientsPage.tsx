import { Outlet } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";


export default function PatientsPage() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
