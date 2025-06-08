import { TechnicianLayout } from "./layouts/technician-layout"
import { TechnicianVisitsTable } from "./technician-visits-table"

export function TechnicianVisitsPage() {
  return (
    <TechnicianLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Visites du jour</h1>
        <TechnicianVisitsTable />
      </div>
    </TechnicianLayout>
  )
}
