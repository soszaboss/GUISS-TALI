"use client"

import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import AdminLayout from "../layouts/layout"
import { Link } from "react-router-dom"

export function AdminGlobalSettings() {
  const [autoSave, setAutoSave] = useState(true)
  const [tensionThreshold, setTensionThreshold] = useState([18, 22])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/admin/settings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Paramètres globaux</h1>
            <p className="text-gray-500 mt-1">Configurez les paramètres généraux de la plateforme</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full md:w-[600px]">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="medical">Médical</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
            <TabsTrigger value="forms">Formulaires</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>Configurez les paramètres généraux de la plateforme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nom du site</Label>
                    <Input id="siteName" defaultValue="Doccure - Plateforme médicale" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email de contact</Label>
                    <Input id="contactEmail" type="email" defaultValue="contact@doccure.fr" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Format de date</Label>
                    <Select defaultValue="dd/MM/yyyy">
                      <SelectTrigger id="dateFormat">
                        <SelectValue placeholder="Sélectionner un format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">JJ/MM/AAAA</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/JJ/AAAA</SelectItem>
                        <SelectItem value="yyyy-MM-dd">AAAA-MM-JJ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Sécurité</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="twoFactorAuth">Authentification à deux facteurs</Label>
                        <p className="text-sm text-gray-500">
                          Exiger l'authentification à deux facteurs pour tous les utilisateurs
                        </p>
                      </div>
                      <Switch id="twoFactorAuth" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="passwordExpiry">Expiration des mots de passe</Label>
                        <p className="text-sm text-gray-500">
                          Forcer les utilisateurs à changer leur mot de passe tous les 90 jours
                        </p>
                      </div>
                      <Switch id="passwordExpiry" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Nombre maximal de tentatives de connexion</Label>
                      <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Sauvegarde</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="autoSave">Sauvegarde automatique</Label>
                        <p className="text-sm text-gray-500">
                          Sauvegarder automatiquement les données lors de la modification
                        </p>
                      </div>
                      <Switch id="autoSave" checked={autoSave} onCheckedChange={setAutoSave} />
                    </div>
                    {autoSave && (
                      <div className="space-y-2">
                        <Label htmlFor="autoSaveInterval">Intervalle de sauvegarde (minutes)</Label>
                        <Input id="autoSaveInterval" type="number" defaultValue="15" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres médicaux</CardTitle>
                <CardDescription>Configurez les seuils et paramètres médicaux</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Seuils de tension oculaire</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Plage normale (mmHg)</Label>
                        <span className="text-sm text-gray-500">
                          {tensionThreshold[0]} - {tensionThreshold[1]} mmHg
                        </span>
                      </div>
                      <Slider
                        value={tensionThreshold}
                        min={10}
                        max={30}
                        step={1}
                        onValueChange={setTensionThreshold}
                        className="py-4"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="hypertensionThreshold">Seuil d'hypertension (mmHg)</Label>
                        <Input id="hypertensionThreshold" type="number" defaultValue="22" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hypotensionThreshold">Seuil d'hypotension (mmHg)</Label>
                        <Input id="hypotensionThreshold" type="number" defaultValue="12" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Critères de vision</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="minVisualAcuity">Acuité visuelle minimale</Label>
                        <Select defaultValue="8/10">
                          <SelectTrigger id="minVisualAcuity">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5/10">5/10</SelectItem>
                            <SelectItem value="6/10">6/10</SelectItem>
                            <SelectItem value="7/10">7/10</SelectItem>
                            <SelectItem value="8/10">8/10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visualFieldMin">Champ visuel minimal (degrés)</Label>
                        <Input id="visualFieldMin" type="number" defaultValue="120" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="colorVisionRequired">Vision des couleurs requise</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="colorVisionRequired">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Non requise</SelectItem>
                          <SelectItem value="basic">Basique (rouge/vert/jaune)</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="complete">Complète</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Textes par défaut pour les conclusions</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="compatibleText">Conclusion - Vision compatible</Label>
                      <Textarea
                        id="compatibleText"
                        defaultValue="La vision du patient est compatible avec la conduite automobile selon les critères en vigueur."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restrictedText">Conclusion - Vision compatible avec restrictions</Label>
                      <Textarea
                        id="restrictedText"
                        defaultValue="La vision du patient est compatible avec la conduite automobile avec les restrictions suivantes : port de correction obligatoire."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incompatibleText">Conclusion - Vision incompatible</Label>
                      <Textarea
                        id="incompatibleText"
                        defaultValue="La vision du patient n'est pas compatible avec la conduite automobile selon les critères en vigueur."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres des rapports</CardTitle>
                <CardDescription>Configurez les options d'exportation et de génération de rapports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Format d'exportation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="defaultExportFormat">Format d'exportation par défaut</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger id="defaultExportFormat">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pdfPageSize">Taille de page PDF</Label>
                      <Select defaultValue="a4">
                        <SelectTrigger id="pdfPageSize">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a4">A4</SelectItem>
                          <SelectItem value="letter">Letter</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeLogoInReports">Inclure le logo dans les rapports</Label>
                      <p className="text-sm text-gray-500">Ajouter le logo de l'entreprise sur tous les rapports</p>
                    </div>
                    <Switch id="includeLogoInReports" defaultChecked />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">En-tête et pied de page</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reportHeader">En-tête de rapport</Label>
                      <Textarea
                        id="reportHeader"
                        defaultValue="Doccure - Plateforme médicale\nRapport confidentiel"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reportFooter">Pied de page de rapport</Label>
                      <Textarea
                        id="reportFooter"
                        defaultValue="Document généré le {date} à {time}\nConfidentiel - Usage médical uniquement"
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Options de confidentialité</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="watermarkReports">Filigrane de confidentialité</Label>
                        <p className="text-sm text-gray-500">
                          Ajouter un filigrane "CONFIDENTIEL" sur tous les rapports
                        </p>
                      </div>
                      <Switch id="watermarkReports" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="passwordProtectReports">Protection par mot de passe</Label>
                        <p className="text-sm text-gray-500">
                          Protéger les rapports PDF par un mot de passe lors de l'exportation
                        </p>
                      </div>
                      <Switch id="passwordProtectReports" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres des formulaires</CardTitle>
                <CardDescription>Configurez les champs obligatoires et les options des formulaires</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Champs obligatoires - Dossier patient</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="patientPhoneRequired">Numéro de téléphone</Label>
                      <Switch id="patientPhoneRequired" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="patientAddressRequired">Adresse</Label>
                      <Switch id="patientAddressRequired" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="patientEmailRequired">Email</Label>
                      <Switch id="patientEmailRequired" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="patientBirthDateRequired">Date de naissance</Label>
                      <Switch id="patientBirthDateRequired" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="patientInsuranceRequired">Informations d'assurance</Label>
                      <Switch id="patientInsuranceRequired" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Champs obligatoires - Examen technique</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="visualAcuityRequired">Acuité visuelle</Label>
                      <Switch id="visualAcuityRequired" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="visualFieldRequired">Champ visuel</Label>
                      <Switch id="visualFieldRequired" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="colorVisionRequired">Vision des couleurs</Label>
                      <Switch id="colorVisionRequired" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contrastSensitivityRequired">Sensibilité au contraste</Label>
                      <Switch id="contrastSensitivityRequired" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ocularTensionRequired">Tension oculaire</Label>
                      <Switch id="ocularTensionRequired" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Champs obligatoires - Validation médicale</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="medicalHistoryRequired">Antécédents médicaux</Label>
                      <Switch id="medicalHistoryRequired" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="medicationsRequired">Médicaments actuels</Label>
                      <Switch id="medicationsRequired" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allergiesRequired">Allergies</Label>
                      <Switch id="allergiesRequired" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="conclusionRequired">Conclusion médicale</Label>
                      <Switch id="conclusionRequired" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="recommendationsRequired">Recommandations</Label>
                      <Switch id="recommendationsRequired" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
