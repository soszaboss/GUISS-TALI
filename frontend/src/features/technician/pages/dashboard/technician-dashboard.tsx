import { TechnicianStats } from "../../components/statistics/technician-stats"
import { TechnicianVisitsTable } from "../../components/visits/technician-visits-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TechnicianActivityChart } from "../../components/charts/technician-activity-chart"
import { TechnicianCompletionChart } from "../../components/charts/technician-completion-chart"
import { TechnicianUpcomingVisits } from "../../components/visits/technician-upcoming-visits"
import { TechnicianAlerts } from "../../components/alerts/technician-alerts"
import { TechnicianLayout } from "../../components/layouts/technician-layout"

export default function TechnicianDashboard() {
  return (
    <TechnicianLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>

        <TechnicianStats />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Visites à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <TechnicianUpcomingVisits />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Alertes</CardTitle>
            </CardHeader>
            <CardContent>
              <TechnicianAlerts />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="completion">Taux de complétion</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Activité hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <TechnicianActivityChart />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completion" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Taux de complétion des examens</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <TechnicianCompletionChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Visites récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <TechnicianVisitsTable />
          </CardContent>
        </Card>
      </div>
    </TechnicianLayout>
  )
}
