// import type { Metadata } from "next"

import AdminLayout from "@/features/admin/components/layouts/layout";
import AdminMedicalRecordDetail from "@/features/admin/components/medical-records/medical-record-detail";

// export const metadata: Metadata = {
//   title: "Détail fiche médicale | Admin Doccure",
//   description: "Détail d'une fiche médicale pour les administrateurs de la plateforme Doccure",
// }

export default function AdminMedicalRecordDetailPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <AdminMedicalRecordDetail id={params.id} />
    </AdminLayout>
  )
}
