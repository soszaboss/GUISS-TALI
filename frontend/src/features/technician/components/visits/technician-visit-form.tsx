import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertTriangle,
  CheckCircle,
  Save,
  Upload,
  ArrowLeft,
  Clock,
  Calendar,
  FileText,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Link } from "react-router-dom"



export function TechnicianVisitForm() {
  const [activeTab, setActiveTab] = useState("form")
  const [formStatus, setFormStatus] = useState<"draft" | "in_progress" | "completed">("in_progress")
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  // États pour les sections du formulaire
  const [acuiteData, setAcuiteData] = useState({
    avsc_od: "8/10",
    avsc_og: "9/10",
    avsc_odg: "9/10",
    avac_od: "10/10",
    avac_og: "10/10",
    avac_odg: "10/10",
  })

  const [refractionData, setRefractionData] = useState({
    od_s: "+0.25",
    od_c: "-0.50",
    od_a: "180",
    og_s: "+0.50",
    og_c: "-0.75",
    og_a: "175",
    dp: "62",
  })

  const [tensionData, setTensionData] = useState({
    od: "14",
    og: "15",
    ttt_hypotonisant: false,
    ttt_hypotonisant_value: "",
  })

  const [pachymetrieData, setPachymetrieData] = useState({
    od: "540",
    og: "545",
  })

  const [perimetrieData, setPerimetrieData] = useState({
    limite_inferieure: "60",
    limite_superieure: "55",
    nasale: "65",
    temporale: "85",
    score_esterman: "95",
  })

  // Fonction pour vérifier si une section est complète
  const isSectionComplete = (section: string) => {
    switch (section) {
      case "acuite":
        return Object.values(acuiteData).every((value) => value.trim() !== "")
      case "refraction":
        return Object.values(refractionData).every((value) => value.trim() !== "")
      case "tension":
        return (
          tensionData.od.trim() !== "" &&
          tensionData.og.trim() !== "" &&
          (!tensionData.ttt_hypotonisant || tensionData.ttt_hypotonisant_value.trim() !== "")
        )
      case "pachymetrie":
        return pachymetrieData.od.trim() !== "" && pachymetrieData.og.trim() !== ""
      case "perimetrie":
        return Object.values(perimetrieData).every((value) => value.trim() !== "")
      default:
        return false
    }
  }

  // Fonction pour gérer la sauvegarde du formulaire
  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus("saving")

    try {
      // Simuler une sauvegarde API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Succès
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  // Fonction pour soumettre le formulaire au médecin
  const handleSubmit = async () => {
    setIsSaving(true)
    setSaveStatus("saving")

    try {
      // Simuler une soumission API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Succès
      setFormStatus("completed")
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  // Fonction pour gérer les changements dans les champs d'acuité
  const handleAcuiteChange = (field: string, value: string) => {
    setAcuiteData((prev) => ({ ...prev, [field]: value }))
    setSaveStatus("idle")
  }

  // Fonction pour gérer les changements dans les champs de réfraction
  const handleRefractionChange = (field: string, value: string) => {
    setRefractionData((prev) => ({ ...prev, [field]: value }))
    setSaveStatus("idle")
  }

  // Fonction pour gérer les changements dans les champs de tension
  const handleTensionChange = (field: string, value: string | boolean) => {
    setTensionData((prev) => ({ ...prev, [field]: value }))
    setSaveStatus("idle")
  }

  // Fonction pour gérer les changements dans les champs de pachymétrie
  const handlePachymetrieChange = (field: string, value: string) => {
    setPachymetrieData((prev) => ({ ...prev, [field]: value }))
    setSaveStatus("idle")
  }

  // Fonction pour gérer les changements dans les champs de périmétrie
  const handlePerimetrieChange = (field: string, value: string) => {
    setPerimetrieData((prev) => ({ ...prev, [field]: value }))
    setSaveStatus("idle")
  }

  // Vérifier si le formulaire est complet
  const isFormComplete =
    isSectionComplete("acuite") &&
    isSectionComplete("refraction") &&
    isSectionComplete("tension") &&
    isSectionComplete("pachymetrie") &&
    isSectionComplete("perimetrie")

  // Calculer le pourcentage de complétion
  const calculateCompletionPercentage = () => {
    let completedSections = 0
    if (isSectionComplete("acuite")) completedSections++
    if (isSectionComplete("refraction")) completedSections++
    if (isSectionComplete("tension")) completedSections++
    if (isSectionComplete("pachymetrie")) completedSections++
    if (isSectionComplete("perimetrie")) completedSections++

    return (completedSections / 5) * 100
  }

  // Vérifier si le score Esterman est inférieur à 70 (alerte)
  const hasEstermanAlert = Number.parseFloat(perimetrieData.score_esterman) < 70

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Link to="/technician/visits">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Examen Technique</h1>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>15/05/2023</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>09:00</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {formStatus === "completed" ? (
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                Soumis au médecin
              </Badge>
            ) : formStatus === "in_progress" ? (
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                En cours
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-800 px-3 py-1">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Brouillon
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informations patient</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="h-20 w-20 mb-3">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Martin Dupont" />
                    <AvatarFallback>MD</AvatarFallback>
                  </Avatar>
                  <h2 className="text-lg font-bold">Martin Dupont</h2>
                  <p className="text-sm text-muted-foreground">48 ans • Masculin</p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Téléphone</span>
                    <span className="text-sm font-medium">06 12 34 56 78</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm font-medium">m.dupont@email.com</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Médecin</span>
                    <span className="text-sm font-medium">Dr. Sophie Martin</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Dernière visite</span>
                    <span className="text-sm font-medium">15/11/2022</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Type d'examen</span>
                    <span className="text-sm font-medium">Examen annuel</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to={`/technician/medical-records/1`}>
                    <Button variant="outline" className="w-full" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Voir dossier médical
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {formStatus !== "completed" && (
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Complétion du formulaire</span>
                        <span className="text-sm font-medium">{calculateCompletionPercentage()}%</span>
                      </div>
                      <Progress value={calculateCompletionPercentage()} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full ${isSectionComplete("acuite") ? "bg-green-500" : "bg-amber-500"}`}
                          ></div>
                          <span className="text-sm ml-2">Acuité Visuelle</span>
                        </div>
                        {isSectionComplete("acuite") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full ${isSectionComplete("refraction") ? "bg-green-500" : "bg-amber-500"}`}
                          ></div>
                          <span className="text-sm ml-2">Réfraction</span>
                        </div>
                        {isSectionComplete("refraction") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full ${isSectionComplete("tension") ? "bg-green-500" : "bg-amber-500"}`}
                          ></div>
                          <span className="text-sm ml-2">Tension Oculaire</span>
                        </div>
                        {isSectionComplete("tension") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full ${isSectionComplete("pachymetrie") ? "bg-green-500" : "bg-amber-500"}`}
                          ></div>
                          <span className="text-sm ml-2">Pachymétrie</span>
                        </div>
                        {isSectionComplete("pachymetrie") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full ${isSectionComplete("perimetrie") ? "bg-green-500" : "bg-amber-500"}`}
                          ></div>
                          <span className="text-sm ml-2">Périmétrie</span>
                        </div>
                        {isSectionComplete("perimetrie") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="form">Formulaire d'examen</TabsTrigger>
                <TabsTrigger value="history">Historique des examens</TabsTrigger>
              </TabsList>

              <TabsContent value="form">
                <div className="space-y-6">
                  {formStatus === "completed" && (
                    <div className="bg-green-50 p-4 rounded-md flex items-center text-green-800 mb-4 border border-green-200">
                      <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p>Cet examen a été soumis au médecin le 15/05/2023 à 09:45 et ne peut plus être modifié.</p>
                    </div>
                  )}

                  <Accordion
                    type="multiple"
                    defaultValue={["acuite", "refraction", "tension", "pachymetrie", "perimetrie"]}
                    className="space-y-4"
                  >
                    {/* Section 1: Acuité Visuelle */}
                    <AccordionItem value="acuite" className="border rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600">👁</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Acuité Visuelle</span>
                            <span className="text-xs text-muted-foreground">
                              Mesure de la vision sans et avec correction
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center ml-auto mr-4">
                          {isSectionComplete("acuite") ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Complet
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mr-2">
                              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                              Incomplet
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 pt-0">
                        <Card className="border-t-0 rounded-t-none">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div></div>
                              <div className="font-medium text-center">OD</div>
                              <div className="font-medium text-center">OG</div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                              <div className="flex items-center">
                                <span className="font-medium">Sans correction</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">Acuité visuelle sans correction (AVSC)</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <div>
                                <Input
                                  value={acuiteData.avsc_od}
                                  onChange={(e) => handleAcuiteChange("avsc_od", e.target.value)}
                                  disabled={formStatus === "completed"}
                                  className="text-center"
                                />
                              </div>
                              <div>
                                <Input
                                  value={acuiteData.avsc_og}
                                  onChange={(e) => handleAcuiteChange("avsc_og", e.target.value)}
                                  disabled={formStatus === "completed"}
                                  className="text-center"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="flex items-center">
                                <span className="font-medium">Avec correction</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">Acuité visuelle avec correction (AVAC)</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <div>
                                <Input
                                  value={acuiteData.avac_od}
                                  onChange={(e) => handleAcuiteChange("avac_od", e.target.value)}
                                  disabled={formStatus === "completed"}
                                  className="text-center"
                                />
                              </div>
                              <div>
                                <Input
                                  value={acuiteData.avac_og}
                                  onChange={(e) => handleAcuiteChange("avac_og", e.target.value)}
                                  disabled={formStatus === "completed"}
                                  className="text-center"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Section 2: Réfraction */}
                    <AccordionItem value="refraction" className="border rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-purple-600">🧮</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Réfraction Automatisée</span>
                            <span className="text-xs text-muted-foreground">
                              Mesure de la correction optique nécessaire
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center ml-auto mr-4">
                          {isSectionComplete("refraction") ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Complet
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mr-2">
                              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                              Incomplet
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 pt-0">
                        <Card className="border-t-0 rounded-t-none">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div></div>
                              <div className="font-medium text-center">Sphère</div>
                              <div className="font-medium text-center">Cylindre</div>
                              <div className="font-medium text-center">Axe</div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mb-6">
                              <div className="flex items-center font-medium">OD</div>
                              <div>
                                <Input
                                  value={refractionData.od_s}
                                  onChange={(e) => handleRefractionChange("od_s", e.target.value)}
                                  disabled={formStatus === "completed"}
                                  className="text-center"
                                />
                              </div>
                              <div>
                                <Input
                                  value={refractionData.od_c}
                                  onChange={(e) => handleRefractionChange("od_c", e.target.value)}
                                  disabled={formStatus === "completed"}
                                  className="text-center"
                                />
                              </div>
                              <div>
                                <Input
                                  value={refractionData.od_a}
                                  onChange={(e) => handleRefractionChange("od_a", e.target.value)}
                                  disabled={formStatus === "completed"}
                                  className="text-center"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mb-6">
                              <div className="flex items-center font-medium">OG</div>
                              <div>
                                <Input
                                  value={refractionData.og_s}
                                  onChange={(e) => handleRefractionChange("og_s", e.target.value)}
                                  disabled={formStatus === "completed"}
                                  className="text-center"
                                />
                              </div>
                              <div>
                                <Input
                                  value={refractionData.og_c}
                                  onChange={(e) => handleRefractionChange("og_c", e.target.value)}
                                  disabled={formStatus === "completed"}
                                  className="text-center"
                                />
                              </div>
                              <div>
                                <Input
                                  value={refractionData.og_a}
                                  onChange={(e) => handleRefractionChange("og_a", e.target.value)}
                                  disabled={formStatus === "completed"}
                                  className="text-center"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                              <div className="flex items-center font-medium">
                                <span>Distance pupillaire</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">Distance entre les centres des pupilles (en mm)</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <div>
                                <Input
                                  value={refractionData.dp}
                                  onChange={(e) => handleRefractionChange("dp", e.target.value)}
                                  disabled={formStatus === "completed"}
                                  className="text-center"
                                />
                              </div>
                              <div className="col-span-2"></div>
                            </div>
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Section 3: Tension Oculaire */}
                    <AccordionItem value="tension" className="border rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-600">💧</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Tension Oculaire</span>
                            <span className="text-xs text-muted-foreground">Mesure de la pression intraoculaire</span>
                          </div>
                        </div>
                        <div className="flex items-center ml-auto mr-4">
                          {isSectionComplete("tension") ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Complet
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mr-2">
                              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                              Incomplet
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 pt-0">
                        <Card className="border-t-0 rounded-t-none">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="space-y-2">
                                <Label htmlFor="tension_od">OD (mmHg)</Label>
                                <Input
                                  id="tension_od"
                                  value={tensionData.od}
                                  onChange={(e) => handleTensionChange("od", e.target.value)}
                                  disabled={formStatus === "completed"}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="tension_og">OG (mmHg)</Label>
                                <Input
                                  id="tension_og"
                                  value={tensionData.og}
                                  onChange={(e) => handleTensionChange("og", e.target.value)}
                                  disabled={formStatus === "completed"}
                                />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="ttt_hypotonisant"
                                  checked={tensionData.ttt_hypotonisant}
                                  onCheckedChange={(checked) => handleTensionChange("ttt_hypotonisant", checked)}
                                  disabled={formStatus === "completed"}
                                />
                                <Label htmlFor="ttt_hypotonisant">Traitement hypotonisant</Label>
                              </div>

                              {tensionData.ttt_hypotonisant && (
                                <div className="space-y-2">
                                  <Label htmlFor="ttt_hypotonisant_value">Préciser le traitement</Label>
                                  <Input
                                    id="ttt_hypotonisant_value"
                                    value={tensionData.ttt_hypotonisant_value}
                                    onChange={(e) => handleTensionChange("ttt_hypotonisant_value", e.target.value)}
                                    disabled={formStatus === "completed"}
                                  />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Section 4: Pachymétrie */}
                    <AccordionItem value="pachymetrie" className="border rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-pink-600">📏</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Pachymétrie</span>
                            <span className="text-xs text-muted-foreground">Mesure de l'épaisseur de la cornée</span>
                          </div>
                        </div>
                        <div className="flex items-center ml-auto mr-4">
                          {isSectionComplete("pachymetrie") ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Complet
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mr-2">
                              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                              Incomplet
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 pt-0">
                        <Card className="border-t-0 rounded-t-none">
                          <CardContent className="p-6">
                            <div className="mb-2">
                              <p className="text-sm text-muted-foreground">Épaisseur cornéenne centrale (μm)</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="pachy_od">OD</Label>
                                <Input
                                  id="pachy_od"
                                  value={pachymetrieData.od}
                                  onChange={(e) => handlePachymetrieChange("od", e.target.value)}
                                  disabled={formStatus === "completed"}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="pachy_og">OG</Label>
                                <Input
                                  id="pachy_og"
                                  value={pachymetrieData.og}
                                  onChange={(e) => handlePachymetrieChange("og", e.target.value)}
                                  disabled={formStatus === "completed"}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Section 5: Périmétrie */}
                    <AccordionItem value="perimetrie" className="border rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-amber-600">🧠</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Périmétrie Binoculaire</span>
                            <span className="text-xs text-muted-foreground">
                              Évaluation du champ visuel binoculaire
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center ml-auto mr-4">
                          {isSectionComplete("perimetrie") ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Complet
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mr-2">
                              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                              Incomplet
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 pt-0">
                        <Card className={`border-t-0 rounded-t-none ${hasEstermanAlert ? "border-amber-500" : ""}`}>
                          <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                              <div className="space-y-2">
                                <Label htmlFor="limite_superieure">Limite supérieure</Label>
                                <Input
                                  id="limite_superieure"
                                  value={perimetrieData.limite_superieure}
                                  onChange={(e) => handlePerimetrieChange("limite_superieure", e.target.value)}
                                  disabled={formStatus === "completed"}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="limite_inferieure">Limite inférieure</Label>
                                <Input
                                  id="limite_inferieure"
                                  value={perimetrieData.limite_inferieure}
                                  onChange={(e) => handlePerimetrieChange("limite_inferieure", e.target.value)}
                                  disabled={formStatus === "completed"}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="nasale">Limite nasale</Label>
                                <Input
                                  id="nasale"
                                  value={perimetrieData.nasale}
                                  onChange={(e) => handlePerimetrieChange("nasale", e.target.value)}
                                  disabled={formStatus === "completed"}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="temporale">Limite temporale</Label>
                                <Input
                                  id="temporale"
                                  value={perimetrieData.temporale}
                                  onChange={(e) => handlePerimetrieChange("temporale", e.target.value)}
                                  disabled={formStatus === "completed"}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="score_esterman">Score d'Esterman</Label>
                              <Input
                                id="score_esterman"
                                value={perimetrieData.score_esterman}
                                onChange={(e) => handlePerimetrieChange("score_esterman", e.target.value)}
                                disabled={formStatus === "completed"}
                                className={hasEstermanAlert ? "border-amber-500 focus:ring-amber-500" : ""}
                              />

                              {hasEstermanAlert && (
                                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md flex items-center text-amber-800">
                                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <p className="text-sm">
                                    Attention: Score d'Esterman inférieur à 70. Veuillez signaler au médecin.
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="mt-6 space-y-2">
                              <Label htmlFor="perimetrie_image">Image de périmétrie</Label>
                              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Glisser-déposer ou cliquer pour télécharger</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  disabled={formStatus === "completed"}
                                >
                                  Parcourir
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {formStatus !== "completed" && (
                    <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end space-x-4">
                      <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving && saveStatus === "saving" ? "Enregistrement..." : "Enregistrer"}
                      </Button>

                      <Button
                        onClick={handleSubmit}
                        disabled={!isFormComplete || isSaving}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Soumettre au médecin
                      </Button>

                      {saveStatus === "success" && (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Enregistré avec succès
                        </span>
                      )}

                      {saveStatus === "error" && (
                        <span className="text-red-600 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Erreur lors de l'enregistrement
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des examens</CardTitle>
                    <CardDescription>Retrouvez ici l'historique des examens de ce patient.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Médecin</TableHead>
                          <TableHead>Résultat</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>15/11/2022</TableCell>
                          <TableCell>Examen annuel</TableCell>
                          <TableCell>Dr. Sophie Martin</TableCell>
                          <TableCell>Normal</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>20/11/2021</TableCell>
                          <TableCell>Examen annuel</TableCell>
                          <TableCell>Dr. Sophie Martin</TableCell>
                          <TableCell>Normal</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>05/12/2020</TableCell>
                          <TableCell>Examen annuel</TableCell>
                          <TableCell>Dr. Jean Dujardin</TableCell>
                          <TableCell>Prescription lunettes</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
  )
}
