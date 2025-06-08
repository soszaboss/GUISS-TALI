
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Download, Eye, FileText, Printer, User } from "lucide-react"
import { Link } from "react-router-dom"


export default function AdminMedicalRecordDetail() {
  // Dans une application réelle, ces données seraient récupérées depuis une API
  const medicalRecord = {
    id: "MR12345",
    patientId: "P12345",
    patientName: "Jean Dupont",
    dateOfBirth: "15/06/1975",
    gender: "Homme",
    dateCreated: "15/05/2023",
    lastUpdated: "15/05/2023",
    status: "Complet",
    visionStatus: "Compatible",
    category: "Conducteur professionnel",
    technicalExam: {
      date: "15/05/2023",
      examiner: "Dr. Sophie Martin",
      visualAcuity: {
        rightEye: "10/10",
        leftEye: "9/10",
        binocular: "10/10",
      },
      colorVision: "Normal",
      peripheralVision: "Normal",
      intraocularPressure: {
        rightEye: "14 mmHg",
        leftEye: "15 mmHg",
      },
      notes: "Examen technique normal, pas d'anomalies détectées.",
    },
    medicalExam: {
      date: "15/05/2023",
      examiner: "Dr. Thomas Dubois",
      medicalHistory: "Pas d'antécédents médicaux significatifs",
      currentMedications: "Aucun",
      allergies: "Aucune",
      bloodPressure: "120/80 mmHg",
      heartRate: "72 bpm",
      conclusion: "Patient en bonne santé, apte à la conduite sans restrictions.",
      recommendations: "Contrôle dans 2 ans",
    },
    drivingExperience: {
      licenseType: "B, C",
      licenseIssueDate: "10/03/2000",
      yearsOfExperience: 23,
      previousAccidents: "Aucun",
      drivingFrequency: "Quotidienne",
      annualMileage: "50 000 km",
    },
    history: [
      {
        date: "15/05/2023",
        action: "Création de la fiche médicale",
        user: "Dr. Sophie Martin",
      },
      {
        date: "15/05/2023",
        action: "Examen technique réalisé",
        user: "Dr. Sophie Martin",
      },
      {
        date: "15/05/2023",
        action: "Examen médical réalisé",
        user: "Dr. Thomas Dubois",
      },
      {
        date: "15/05/2023",
        action: "Validation finale",
        user: "Dr. Thomas Dubois",
      },
    ],
  }
  const id = medicalRecord.id
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/medical-records"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour aux fiches médicales
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Fiche médicale {id}</h1>
          <p className="text-muted-foreground">Détails complets de la fiche médicale</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Informations du patient</CardTitle>
                <CardDescription>Détails personnels et statut</CardDescription>
              </div>
              <Link to={`/admin/patients/${medicalRecord.patientId}`}>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Voir le profil
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nom</p>
                      <p>{medicalRecord.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ID Patient</p>
                      <p>{medicalRecord.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
                      <p>{medicalRecord.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Genre</p>
                      <p>{medicalRecord.gender}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
                      <p>{medicalRecord.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Statut</p>
                      <Badge variant={medicalRecord.status === "Complet" ? "default" : "outline"}>
                        {medicalRecord.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vision</p>
                      <Badge
                        variant={
                          medicalRecord.visionStatus === "Compatible"
                            ? "default"
                            : medicalRecord.visionStatus === "Compatible avec restrictions"
                              ? "secondary"
                              : medicalRecord.visionStatus === "Incompatible"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {medicalRecord.visionStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="technical">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="technical">Examen technique</TabsTrigger>
              <TabsTrigger value="medical">Examen médical</TabsTrigger>
              <TabsTrigger value="driving">Expérience de conduite</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="technical">
              <Card>
                <CardHeader>
                  <CardTitle>Examen technique</CardTitle>
                  <CardDescription>
                    Réalisé le {medicalRecord.technicalExam.date} par {medicalRecord.technicalExam.examiner}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Acuité visuelle</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Œil droit</p>
                          <p>{medicalRecord.technicalExam.visualAcuity.rightEye}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Œil gauche</p>
                          <p>{medicalRecord.technicalExam.visualAcuity.leftEye}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Binoculaire</p>
                          <p>{medicalRecord.technicalExam.visualAcuity.binocular}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Vision des couleurs</h3>
                        <p>{medicalRecord.technicalExam.colorVision}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Vision périphérique</h3>
                        <p>{medicalRecord.technicalExam.peripheralVision}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Pression intraoculaire</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Œil droit</p>
                          <p>{medicalRecord.technicalExam.intraocularPressure.rightEye}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Œil gauche</p>
                          <p>{medicalRecord.technicalExam.intraocularPressure.leftEye}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Notes</h3>
                      <p>{medicalRecord.technicalExam.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical">
              <Card>
                <CardHeader>
                  <CardTitle>Examen médical</CardTitle>
                  <CardDescription>
                    Réalisé le {medicalRecord.medicalExam.date} par {medicalRecord.medicalExam.examiner}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Antécédents médicaux</h3>
                        <p>{medicalRecord.medicalExam.medicalHistory}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Médicaments actuels</h3>
                        <p>{medicalRecord.medicalExam.currentMedications}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Allergies</h3>
                        <p>{medicalRecord.medicalExam.allergies}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Constantes</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Tension artérielle</p>
                            <p>{medicalRecord.medicalExam.bloodPressure}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Fréquence cardiaque</p>
                            <p>{medicalRecord.medicalExam.heartRate}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Conclusion</h3>
                      <p>{medicalRecord.medicalExam.conclusion}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Recommandations</h3>
                      <p>{medicalRecord.medicalExam.recommendations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="driving">
              <Card>
                <CardHeader>
                  <CardTitle>Expérience de conduite</CardTitle>
                  <CardDescription>Informations relatives à l'expérience de conduite du patient</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Permis de conduire</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Type de permis</p>
                          <p>{medicalRecord.drivingExperience.licenseType}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Date d'obtention</p>
                          <p>{medicalRecord.drivingExperience.licenseIssueDate}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Expérience</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Années d'expérience</p>
                          <p>{medicalRecord.drivingExperience.yearsOfExperience} ans</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Accidents antérieurs</p>
                          <p>{medicalRecord.drivingExperience.previousAccidents}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Habitudes de conduite</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Fréquence</p>
                          <p>{medicalRecord.drivingExperience.drivingFrequency}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Kilométrage annuel</p>
                          <p>{medicalRecord.drivingExperience.annualMileage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Historique</CardTitle>
                  <CardDescription>Historique des actions sur cette fiche médicale</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {medicalRecord.history.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.date} par {item.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de création</p>
                <p>{medicalRecord.dateCreated}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dernière mise à jour</p>
                <p>{medicalRecord.lastUpdated}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID Fiche</p>
                <p>{medicalRecord.id}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Générer un rapport
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Voir l'historique complet
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
