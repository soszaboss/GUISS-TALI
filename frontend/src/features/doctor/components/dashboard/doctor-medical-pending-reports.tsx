import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

export function DoctorMedicalPendingReports() {
  // Ces données seraient normalement récupérées depuis une API
  const pendingReports = [
    {
      id: 1,
      patient: "Jean Dupont",
      date: "15/05/2023",
      type: "Rapport médical",
      status: "draft",
    },
    {
      id: 2,
      patient: "Marie Martin",
      date: "14/05/2023",
      type: "Certificat médical",
      status: "pending",
    },
    {
      id: 3,
      patient: "Pierre Durand",
      date: "12/05/2023",
      type: "Rapport médical",
      status: "pending",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <FileText className="h-4 w-4 mr-2 text-gray-500" />
          Rapports à finaliser
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {pendingReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-sm">{report.patient}</h4>
                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                  <span>{report.date}</span>
                  <span className="mx-1">•</span>
                  <span>{report.type}</span>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 px-2" asChild>
                <Link to={`/doctor/reports/${report.id}`}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Finaliser</span>
                </Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link to="/doctor/reports">Voir tous les rapports</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
