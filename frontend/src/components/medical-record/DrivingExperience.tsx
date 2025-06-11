/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { AlertTriangle } from "lucide-react"
import { ChoiceSelect } from "../ChoiceSelect"
import { choicesMap } from "@/helpers/choicesMap"

export function DrivingExperience({
  drivingData,
  canEditDriving,
  handleDrivingChange,
  handleSave,
  isSaving,
  saveStatus,
}: {
  drivingData: any
  canEditDriving: boolean
  handleDrivingChange: (field: string, value: any) => void
  handleSave: () => void
  isSaving: boolean
  saveStatus: "idle" | "saving" | "success" | "error"
}) {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
            Expérience de conduite
            <span className="ml-2 text-sm font-normal text-gray-500">(Spécifique à cette visite)</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            {!canEditDriving && (
            <div className="bg-yellow-50 p-4 rounded-md flex items-center text-yellow-800 mb-4">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>
                Vous êtes en mode lecture seule. Seuls les médecins et administrateurs peuvent modifier ces
                informations.
                </p>
            </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="kilometersPerYear" className="text-base font-medium">
                Kilomètres parcourus par an
                </Label>
                <Input
                id="kilometersPerYear"
                type="number"
                className="mt-2"
                placeholder="Ex: 15000"
                value={drivingData.kilometersPerYear}
                onChange={(e) => handleDrivingChange("kilometersPerYear", Number.parseInt(e.target.value) || 0)}
                disabled={!canEditDriving}
                />
            </div>

            <div>
                <Label htmlFor="accidents" className="text-base font-medium">
                Nombre d'accidents
                </Label>
                <Input
                id="accidents"
                type="number"
                className="mt-2"
                placeholder="Ex: 0"
                value={drivingData.accidents}
                onChange={(e) => handleDrivingChange("accidents", Number.parseInt(e.target.value) || 0)}
                disabled={!canEditDriving}
                />
            </div>

            {drivingData.accidents > 0 && (
                <div>
                <Label htmlFor="lastAccidentDate" className="text-base font-medium">
                    Date du dernier accident
                </Label>
                <Input
                    id="lastAccidentDate"
                    type="date"
                    className="mt-2"
                    value={drivingData.lastAccidentDate}
                    onChange={(e) => handleDrivingChange("lastAccidentDate", e.target.value)}
                    disabled={!canEditDriving}
                />
                </div>
            )}

            <div>
                <Label htmlFor="nightDriving" className="text-base font-medium">
                Tranche Horaire
                </Label>
                <Input
                id="trancheHoraire"
                type="number" 
                />
            </div>

            <div>
                <Label htmlFor="damage" className="text-base font-medium">
                Dommages
                </Label>
                <ChoiceSelect
                name="damage"
                label=""
                options={choicesMap.DommageChoices}
                value={''}
                onChange={(val) => handleDrivingChange("damage", val)}
                multiple={false}
                />
            </div>

            <div>
                <Label htmlFor="degat" className="text-base font-medium">
                Dégâts
                </Label>
                <ChoiceSelect
                        name="degat"
                        label=""
                        options={choicesMap.DegatChoices}
                        value={''}
                        onChange={(val) => handleDrivingChange("damageType", val)}
                        multiple={false}
                />
            </div>
            </div>

            {canEditDriving && (
            <div className="flex justify-end mt-6">
                <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>

                {saveStatus === "success" && (
                <span className="ml-2 text-green-600 flex items-center">Enregistré avec succès</span>
                )}

                {saveStatus === "error" && (
                <span className="ml-2 text-red-600 flex items-center">Erreur lors de l'enregistrement</span>
                )}
            </div>
            )}
        </CardContent>
    </Card>
  )
}