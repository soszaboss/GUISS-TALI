/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, AlertCircle } from "lucide-react"

type MedicalHistoryProps = {
  formData: any
  errors?: Record<string, string>
  canEdit: boolean
  isSaving: boolean
  saveStatus: "idle" | "saving" | "success" | "error"
  onChange: (field: string, value: any) => void
  onSave: () => void
}

export function MedicalHistory({
  formData,
  errors = {},
  canEdit,
  isSaving,
  saveStatus,
  onChange,
  onSave,
}: MedicalHistoryProps) {
  return (
    <div className="space-y-6">
      {!canEdit && (
        <div className="bg-yellow-50 p-4 rounded-md flex items-center text-yellow-800 mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>
            Vous êtes en mode lecture seule. Seuls les assistants, médecins et administrateurs peuvent modifier ces informations.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Antécédents médicaux et ophtalmologiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="antecedents_medico_chirurgicaux" className="flex">
              Antécédents médico-chirurgicaux
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="antecedents_medico_chirurgicaux"
              placeholder="Ex: Diabète, chirurgie cardiaque, etc."
              value={formData.antecedents_medico_chirurgicaux}
              onChange={(e) => onChange("antecedents_medico_chirurgicaux", e.target.value)}
              disabled={!canEdit}
              className={errors.antecedents_medico_chirurgicaux ? "border-red-500" : ""}
            />
            {errors.antecedents_medico_chirurgicaux && (
              <p className="text-red-500 text-sm">{errors.antecedents_medico_chirurgicaux}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pathologie_ophtalmologique" className="flex">
              Pathologies ophtalmologiques connues
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="pathologie_ophtalmologique"
              placeholder="Ex: Glaucome, myopie forte, etc."
              value={formData.pathologie_ophtalmologique}
              onChange={(e) => onChange("pathologie_ophtalmologique", e.target.value)}
              disabled={!canEdit}
              className={errors.pathologie_ophtalmologique ? "border-red-500" : ""}
            />
            {errors.pathologie_ophtalmologique && (
              <p className="text-red-500 text-sm">{errors.pathologie_ophtalmologique}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addiction">Addictions</Label>
            <Switch
              id="addiction"
              checked={formData.addiction}
              onCheckedChange={(checked) => onChange("addiction", checked)}
              disabled={!canEdit}
            />
          </div>

          {formData.addiction && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <Label htmlFor="type_addiction">Type d'addiction</Label>
              <Select
                value={formData.type_addiction}
                onValueChange={(value) => onChange("type_addiction", value)}
                disabled={!canEdit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tabac">Tabac</SelectItem>
                  <SelectItem value="alcool">Alcool</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>

              {formData.type_addiction === "tabac" && (
                <div className="space-y-2">
                  <Label htmlFor="tabagisme_detail">Détail tabagisme</Label>
                  <Input
                    id="tabagisme_detail"
                    placeholder="Ex: 10 cigarettes/jour"
                    value={formData.tabagisme_detail}
                    onChange={(e) => onChange("tabagisme_detail", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              )}

              {formData.type_addiction === "autre" && (
                <div className="space-y-2">
                  <Label htmlFor="autre_addiction_detail">Détail autre addiction</Label>
                  <Input
                    id="autre_addiction_detail"
                    placeholder="Ex: Cannabis, médicaments, etc."
                    value={formData.autre_addiction_detail}
                    onChange={(e) => onChange("autre_addiction_detail", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="familial">Antécédents familiaux</Label>
            <Textarea
              id="familial"
              placeholder="Ex: Glaucome chez le père, diabète dans la famille, etc."
              value={formData.familial}
              onChange={(e) => onChange("familial", e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="autre_familial_detail">Autres antécédents</Label>
            <Textarea
              id="autre_familial_detail"
              placeholder="Autres informations pertinentes"
              value={formData.autre_familial_detail}
              onChange={(e) => onChange("autre_familial_detail", e.target.value)}
              disabled={!canEdit}
            />
          </div>
        </CardContent>
      </Card>

      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isSaving}>
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
  )
}