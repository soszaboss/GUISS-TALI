"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Users, Clock, Bell } from "lucide-react"
import { AssistantHeader } from "../../components/layout/assistant-header"
import { AssistantSidebar } from "../../components/layout/assistant-sidebar"
import { PatientRegistrationForm } from "../../components/patients/patient-registration-form"
import { RecentPatients } from "../../components/patients/recent-patients"
import { UpcomingAppointments } from "../../components/appointments/upcoming-appointments"
import { AppointmentScheduler } from "../../components/appointments/appointment-scheduler"

export default function AssistantDashboard() {
  const [showNewPatientForm, setShowNewPatientForm] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AssistantSidebar />
      <div className="flex-1">
        <AssistantHeader />
        <main className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Assistant</h1>
              <p className="text-gray-500">Gérez les patients et les rendez-vous</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button
                onClick={() => {
                  setShowNewPatientForm(true)
                  setShowScheduler(false)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Patient
              </Button>
              <Button
                onClick={() => {
                  setShowScheduler(true)
                  setShowNewPatientForm(false)
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Planifier RDV
              </Button>
            </div>
          </div>

          {showNewPatientForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Inscription d'un nouveau patient</CardTitle>
                <CardDescription>Créez un nouveau dossier patient</CardDescription>
              </CardHeader>
              <CardContent>
                <PatientRegistrationForm onSuccess={() => setShowNewPatientForm(false)} />
              </CardContent>
            </Card>
          )}

          {showScheduler && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Planification de rendez-vous</CardTitle>
                <CardDescription>Planifiez une consultation pour un patient</CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentScheduler onSuccess={() => setShowScheduler(false)} />
              </CardContent>
            </Card>
          )}

          {!showNewPatientForm && !showScheduler && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,248</div>
                      <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">RDV Aujourd'hui</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">6 consultations restantes</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Temps d'attente moyen</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">18 min</div>
                      <p className="text-xs text-muted-foreground">-2 min par rapport à la semaine dernière</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Rappels envoyés</CardTitle>
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">32</div>
                      <p className="text-xs text-muted-foreground">Aujourd'hui</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patients récents</CardTitle>
                      <CardDescription>Les 5 derniers patients enregistrés</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentPatients />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Rendez-vous à venir</CardTitle>
                      <CardDescription>Les prochains rendez-vous planifiés</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UpcomingAppointments />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="patients">
                <Card>
                  <CardHeader>
                    <CardTitle>Liste des patients</CardTitle>
                    <CardDescription>Gérez les dossiers patients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-10 text-gray-500">Liste complète des patients sera affichée ici</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendrier des rendez-vous</CardTitle>
                    <CardDescription>Gérez les rendez-vous planifiés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-10 text-gray-500">
                      Calendrier complet des rendez-vous sera affiché ici
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}
