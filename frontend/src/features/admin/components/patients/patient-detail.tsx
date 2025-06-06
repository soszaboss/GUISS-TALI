import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, FileText, Mail, MapPin, Phone, User } from "lucide-react"
import { Link } from "react-router-dom"



export default function AdminPatientDetail() {
  // Dans une application réelle, ces données seraient récupérées depuis une API
  const patient = {
    id: "P12345",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "06 12 34 56 78",
    dateOfBirth: "15/06/1975",
    gender: "Homme",
    address: "123 Rue de Paris, 75001 Paris",
    registrationDate: "10/01/2022",
    status: "Actif",
    category: "Conducteur professionnel",
    medicalRecords: [
      {
        id: "MR12345",
        date: "15/05/2023",
        type: "Examen complet",
        doctor: "Dr. Thomas Dubois",
        status: "Complet",
        visionStatus: "Compatible",
      },
      {
        id: "MR12340",
        date: "15/05/2022",
        type: "Examen complet",
        doctor: "Dr. Sophie Martin",
        status: "Complet",
        visionStatus: "Compatible",
      },
      {
        id: "MR12335",
        date: "15/05/2021",
        type: "Examen complet",
        doctor: "Dr. Thomas Dubois",
        status: "Complet",
        visionStatus: "Compatible avec restrictions",
      },
    ],
    appointments: [
      {
        id: "A12345",
        date: "15/05/2023",
        time: "10:00",
        type: "Examen de vision",
        doctor: "Dr. Thomas Dubois",
        status: "Terminé",
      },
      {
        id: "A12346",
        date: "20/06/2023",
        time: "14:30",
        type: "Suivi médical",
        doctor: "Dr. Sophie Martin",
        status: "Planifié",
      },
    ],
    notes: [
      {
        id: "N12345",
        date: "15/05/2023",
        author: "Dr. Thomas Dubois",
        content: "Patient en bonne santé générale. Recommandation de porter des lunettes pour la conduite de nuit.",
      },
      {
        id: "N12346",
        date: "10/01/2022",
        author: "Assistant médical",
        content: "Première visite. Patient enregistré dans le système.",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/patients"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour aux patients
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Patient: {patient.name}</h1>
          <p className="text-muted-foreground">
            ID: {patient.id} | Enregistré le {patient.registrationDate}
          </p>
        </div>
          <Button variant="default" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Voir la fiche médicale
          </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Détails du patient</CardDescription>
              </div>
              <Badge variant={patient.status === "Actif" ? "default" : "outline"}>{patient.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
                      <p>{patient.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{patient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                      <p>{patient.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
                      <p>
                        {patient.dateOfBirth} ({2023 - Number.parseInt(patient.dateOfBirth.split("/")[2])} ans)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Genre</p>
                      <p>{patient.gender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                      <p>{patient.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
                <p>{patient.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date d'enregistrement</p>
                <p>{patient.registrationDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID Patient</p>
                <p>{patient.id}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Créer une nouvelle fiche
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Planifier un rendez-vous
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
