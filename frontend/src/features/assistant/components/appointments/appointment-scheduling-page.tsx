import { useState } from "react"
import { AppointmentScheduler } from "./appointment-scheduler"
import { AppointmentForm } from "./appointment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AppointmentSchedulingPage() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [refreshScheduler, setRefreshScheduler] = useState(0)

  const handleAppointmentCreated = () => {
    setActiveTab("calendar")
    // Force refresh the scheduler to show new appointments
    setRefreshScheduler((prev) => prev + 1)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Rendez-vous</h1>

      <Tabs defaultValue="calendar" onValueChange={setActiveTab} value={activeTab} className=" mx-auto">
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="new">Nouveau Rendez-vous</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des Rendez-vous</CardTitle>
              <CardDescription>Visualisez et gérez tous les rendez-vous programmés</CardDescription>
            </CardHeader>

            <CardContent>
              <AppointmentScheduler key={refreshScheduler} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Nouveau Rendez-vous</CardTitle>
              <CardDescription>Créez un nouveau rendez-vous avec suivi automatique</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentForm onAppointmentCreated={handleAppointmentCreated} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
