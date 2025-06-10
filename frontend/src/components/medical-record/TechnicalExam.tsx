/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { AlertTriangle } from "lucide-react"
import { ChoiceSelect } from "../ChoiceSelect"
import { choicesMap } from "@/helpers/choicesMap"

export function TechnicalExam({
  technicalData,
  canEditTechnical,
  handleTechnicalChange,
  handleSave,
  isSaving,
  saveStatus,
}: {
  technicalData: any
  canEditTechnical: boolean
  handleTechnicalChange: (field: string, value: any) => void
  handleSave: () => void
  isSaving: boolean
  saveStatus: "idle" | "saving" | "success" | "error"
}) {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
            Examen technique
            <span className="ml-2 text-sm font-normal text-gray-500">
                (Rempli par le technicien: {technicalData.technician || "Non assigné"})
            </span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            {!canEditTechnical && (
            <div className="bg-yellow-50 p-4 rounded-md flex items-center text-yellow-800 mb-4">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>
                Vous êtes en mode lecture seule. Seuls les techniciens et administrateurs peuvent modifier ces
                informations.
                </p>
            </div>
            )}

            <div className="space-y-6">
            {/* Acuité visuelle */}
            <Card>
                <CardHeader>
                <CardTitle>Acuité Visuelle</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="avsc_od">AVSC OD</Label>
                    <Input
                    id="avsc_od"
                    value={technicalData.avsc_od}
                    onChange={(e) => handleTechnicalChange("avsc_od", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="avsc_od">AVAC OD</Label>
                    <Input
                    id="avsc_od"
                    value={technicalData.avsc_od}
                    onChange={(e) => handleTechnicalChange("avsc_od", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="avsc_og">AVSC OG</Label>
                    <Input
                    id="avsc_og"
                    value={technicalData.avsc_og}
                    onChange={(e) => handleTechnicalChange("avsc_og", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="avsc_og">AVAC OG</Label>
                    <Input
                    id="avsc_og"
                    value={technicalData.avsc_og}
                    onChange={(e) => handleTechnicalChange("avsc_og", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="avac_od">AVSC ODG</Label>
                    <Input
                    id="avac_od"
                    value={technicalData.avac_od}
                    onChange={(e) => handleTechnicalChange("avac_od", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="avac_og">AVAC ODG</Label>
                    <Input
                    id="avac_og"
                    value={technicalData.avac_og}
                    onChange={(e) => handleTechnicalChange("avac_og", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>
                </CardContent>
            </Card>

            {/* Réfraction */}
            <Card>
                <CardHeader>
                <CardTitle>Réfraction</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-center space-x-2 mb-5">
                    <Switch
                    id="correction_optique"
                    checked={technicalData.correction_optique}
                    onCheckedChange={(checked) => handleTechnicalChange("correction_optique", checked)}
                    disabled={false}
                    />
                    <Label htmlFor="ttt_hypotonisant">Correction optique</Label>
                </div>
                {technicalData.correction_optique && (
                    <><div className="grid grid-cols-5 gap-4 mb-4">
                    <div className="font-medium">Œil</div>
                    <div className="font-medium">Sphère</div>
                    <div className="font-medium">Cylindre</div>
                    <div className="font-medium">Axe</div>
                    <div className="font-medium">CAV</div>
                    </div><div className="grid grid-cols-5 gap-4 mb-4">
                        <div className="flex items-center">OD</div>
                        <Input
                        value={technicalData.od_s}
                        onChange={(e) => handleTechnicalChange("od_s", e.target.value)}
                        disabled={!canEditTechnical} />
                        <Input
                        value={technicalData.od_c}
                        onChange={(e) => handleTechnicalChange("od_c", e.target.value)}
                        disabled={!canEditTechnical} />
                        <Input
                        value={technicalData.od_c}
                        onChange={(e) => handleTechnicalChange("od_c", e.target.value)}
                        disabled={!canEditTechnical} />
                        <Input
                        value={technicalData.od_c}
                        onChange={(e) => handleTechnicalChange("od_c", e.target.value)}
                        disabled={!canEditTechnical} />
                    </div><div className="grid grid-cols-5 gap-4">
                        <div className="flex items-center">OG</div>
                        <Input
                        value={technicalData.og_s}
                        onChange={(e) => handleTechnicalChange("og_s", e.target.value)}
                        disabled={!canEditTechnical} />
                        <Input
                        value={technicalData.og_c}
                        onChange={(e) => handleTechnicalChange("og_c", e.target.value)}
                        disabled={!canEditTechnical} />
                        <Input
                        value={technicalData.og_c}
                        onChange={(e) => handleTechnicalChange("og_c", e.target.value)}
                        disabled={!canEditTechnical} />
                        <Input
                        value={technicalData.og_c}
                        onChange={(e) => handleTechnicalChange("og_c", e.target.value)}
                        disabled={!canEditTechnical} />
                    </div></>
                )}
                </CardContent>
            </Card>

            {/* Tension oculaire */}
            <Card>
                <CardHeader>
                <CardTitle>Tension Oculaire</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="od">OD</Label>
                    <Input
                    id="od"
                    value={technicalData.od}
                    onChange={(e) => handleTechnicalChange("od", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="og">OG</Label>
                    <Input
                    id="og"
                    value={technicalData.og}
                    onChange={(e) => handleTechnicalChange("og", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>

                <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                    <Switch
                        id="ttt_hypotonisant"
                        checked={technicalData.ttt_hypotonisant}
                        onCheckedChange={(checked) => handleTechnicalChange("ttt_hypotonisant", checked)}
                        disabled={false}
                    />
                    <Label htmlFor="ttt_hypotonisant">Traitement hypotonisant</Label>
                    </div>

                    {technicalData.ttt_hypotonisant && (
                    <div className="mt-2">
                        <ChoiceSelect
                            label="Préciser le traitement" 
                            name="ttt_hypotonisant_value"
                            options={choicesMap.HypotonisantValue}
                            value={technicalData.ttt_hypotonisant_value}
                            onChange={(value) => handleTechnicalChange("ttt_hypotonisant_value", String(value))}
                            multiple={false}
                        />
                    </div>
                    )}
                </div>
                </CardContent>
            </Card>

            {/* Pachymétrie */}
            <Card>
                <CardHeader>
                <CardTitle>Pachymétrie</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pachy_od">OD</Label>
                    <Input
                    id="pachy_od"
                    value={technicalData.pachy_od}
                    onChange={(e) => handleTechnicalChange("pachy_od", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pachy_og">OG</Label>
                    <Input
                    id="pachy_og"
                    value={technicalData.pachy_og}
                    onChange={(e) => handleTechnicalChange("pachy_og", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pachy_od">CTOOD</Label>
                    <Input
                    id="pachy_od"
                    value={technicalData.pachy_od}
                    onChange={(e) => handleTechnicalChange("pachy_od", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pachy_og">CTOOG</Label>
                    <Input
                    id="pachy_og"
                    value={technicalData.pachy_og}
                    onChange={(e) => handleTechnicalChange("pachy_og", e.target.value)}
                    disabled={!canEditTechnical}
                    />
                </div>
                </CardContent>
            </Card>

            {canEditTechnical && (
                <div className="flex justify-end">
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
            </div>
        </CardContent>
    </Card>
  )
}