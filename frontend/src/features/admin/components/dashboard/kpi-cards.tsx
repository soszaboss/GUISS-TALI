"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Activity, AlertTriangle, Clock, CheckSquare } from "lucide-react"

export default function AdminKpiCards() {
  // Ces données seraient normalement récupérées depuis une API
  const kpiData = {
    totalDrivers: 1245,
    weeklyVisits: 87,
    completedVisits: {
      technicians: 42,
      doctors: 38,
    },
    criticalCases: 5,
    averageDelay: "1.2 jours",
    completionRate: "94%",
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conducteurs enregistrés</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="pt-2 pb-4">
          <div className="text-2xl font-bold">{kpiData.totalDrivers}</div>
          <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visites planifiées cette semaine</CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="pt-2 pb-4">
          <div className="text-2xl font-bold">{kpiData.weeklyVisits}</div>
          <p className="text-xs text-muted-foreground">+4% par rapport à la semaine dernière</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visites réalisées</CardTitle>
          <Activity className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="pt-2 pb-4">
          <div className="text-2xl font-bold">
            {kpiData.completedVisits.technicians + kpiData.completedVisits.doctors}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Techniciens: {kpiData.completedVisits.technicians}</span>
            <span>Médecins: {kpiData.completedVisits.doctors}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cas critiques détectés</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent className="pt-2 pb-4">
          <div className="text-2xl font-bold">{kpiData.criticalCases}</div>
          <p className="text-xs text-muted-foreground">-2 par rapport à la semaine dernière</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Délai moyen de validation</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="pt-2 pb-4">
          <div className="text-2xl font-bold">{kpiData.averageDelay}</div>
          <p className="text-xs text-muted-foreground">-0.3 jour par rapport au mois dernier</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de complétion global</CardTitle>
          <CheckSquare className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent className="pt-2 pb-4">
          <div className="text-2xl font-bold">{kpiData.completionRate}</div>
          <p className="text-xs text-muted-foreground">+2% par rapport au mois dernier</p>
        </CardContent>
      </Card>
    </div>
  )
}
