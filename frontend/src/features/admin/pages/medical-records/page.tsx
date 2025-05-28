import { Outlet } from "react-router-dom";
import AdminLayout from "../../components/layouts/layout";

const AdminMedicalRecordsPage = () => {
  return (
     <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminMedicalRecordsPage;
