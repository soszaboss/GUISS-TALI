/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { AlertTriangle } from "lucide-react"
import { ChoiceSelect } from "../ChoiceSelect"
import { choicesMap } from "@/helpers/choicesMap"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function ClinicalExam({
  clinicalData,
  canEditClinical,
  handleClinicalChange,
  handleSave,
  isSaving,
  saveStatus,
}: {
  clinicalData: { od: any; og: any; conclusion_conduite?: any; cat?: any; traitement?: any; observation?: any; rv?: any }
  canEditClinical: boolean
  handleClinicalChange: (eye: "od" | "og", field: string, value: any) => void
  handleSave: () => void
  isSaving: boolean
  saveStatus: "idle" | "saving" | "success" | "error"
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Examen clinique
          <span className="ml-2 text-sm font-normal text-gray-500">(À compléter par le médecin)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!canEditClinical && (
          <div className="bg-yellow-50 p-4 rounded-md flex items-center text-yellow-800 mb-4">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>
              Vous êtes en mode lecture seule. Seuls les médecins et administrateurs peuvent modifier ces informations.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Plaintes */}
          <Card>
            <CardHeader>
              <CardTitle>Plaintes</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="od" className="w-full">
                <TabsList>
                  <TabsTrigger value="od">OD (œil droit)</TabsTrigger>
                  <TabsTrigger value="og">OG (œil gauche)</TabsTrigger>
                </TabsList>
                <TabsContent value="od">
                  <div className="space-y-4 grid">
                    <ChoiceSelect
                    name="od_symptomes"
                    label="Symptômes"
                    options={choicesMap.Symptomes}
                    value={clinicalData.od.symptomes}
                    onChange={(val) => handleClinicalChange("od", "symptomes", val)}
                    multiple={false}
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="flex items-start space-x-2">
                        <Checkbox
                            id="diplopie_od"
                            checked={clinicalData.od.diplopie}
                            onCheckedChange={(checked) => handleClinicalChange("od", "diplopie", checked === true)}
                            disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="diplopie_od">Diplopie</Label>
                            {clinicalData.od.diplopie && (
                            <Select
                                value={clinicalData.od.diplopie_cote}
                                onValueChange={(value) => handleClinicalChange("od", "diplopie_cote", value)}
                                disabled={!canEditClinical}
                            >
                                <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="monoculaire">Monoculaire</SelectItem>
                                <SelectItem value="binoculaire">Binoculaire</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        </div>
                        </div>
                        <div className="flex items-start space-x-2">
                        <Checkbox
                            id="strabisme_od"
                            checked={clinicalData.od.strabisme}
                            onCheckedChange={(checked) => handleClinicalChange("od", "strabisme", checked === true)}
                            disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="strabisme_od">Strabisme</Label>
                            {clinicalData.od.strabisme && (
                            <Select
                                value={clinicalData.od.strabisme_cote}
                                onValueChange={(value) => handleClinicalChange("od", "strabisme_cote", value)}
                                disabled={!canEditClinical}
                            >
                                <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="od">OD</SelectItem>
                                <SelectItem value="og">OG</SelectItem>
                                <SelectItem value="odg">ODG</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        </div>
                        </div>
                        <div className="flex items-start space-x-2">
                        <Checkbox
                            id="strabisme_od"
                            checked={clinicalData.od.nystagmus}
                            onCheckedChange={(checked) => handleClinicalChange("od", "nystagmus", checked === true)}
                            disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="nystagmus_od">Nystagmus</Label>
                            {clinicalData.od.nystagmus && (
                            <Select
                                value={clinicalData.od.nystagmus_cote}
                                onValueChange={(value) => handleClinicalChange("od", "nystagmus_cote", value)}
                                disabled={!canEditClinical}
                            >
                                <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="od">OD</SelectItem>
                                <SelectItem value="og">OG</SelectItem>
                                <SelectItem value="odg">ODG</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        </div>
                        </div>
                        <div className="flex items-start space-x-2">
                        <Checkbox
                            id="strabisme_od"
                            checked={clinicalData.od.strabisme}
                            onCheckedChange={(checked) => handleClinicalChange("od", "strabisme", checked === true)}
                            disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="strabisme_od">Strabisme</Label>
                            {clinicalData.od.strabisme && (
                            <Select
                                value={clinicalData.od.strabisme_cote}
                                onValueChange={(value) => handleClinicalChange("od", "strabisme_cote", value)}
                                disabled={!canEditClinical}
                            >
                                <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="od">OD</SelectItem>
                                <SelectItem value="og">OG</SelectItem>
                                <SelectItem value="odg">ODG</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        </div>
                        </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="og">
                   <div className="space-y-4 grid">
                    <ChoiceSelect
                    name="od_symptomes"
                    label="Symptômes"
                    options={choicesMap.Symptomes}
                    value={clinicalData.od.symptomes}
                    onChange={(val) => handleClinicalChange("od", "symptomes", val)}
                    multiple={false}
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="flex items-start space-x-2">
                        <Checkbox
                            id="diplopie_od"
                            checked={clinicalData.od.diplopie}
                            onCheckedChange={(checked) => handleClinicalChange("od", "diplopie", checked === true)}
                            disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="diplopie_od">Diplopie</Label>
                            {clinicalData.od.diplopie && (
                            <Select
                                value={clinicalData.od.diplopie_cote}
                                onValueChange={(value) => handleClinicalChange("od", "diplopie_cote", value)}
                                disabled={!canEditClinical}
                            >
                                <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="monoculaire">Monoculaire</SelectItem>
                                <SelectItem value="binoculaire">Binoculaire</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        </div>
                        </div>
                        <div className="flex items-start space-x-2">
                        <Checkbox
                            id="strabisme_od"
                            checked={clinicalData.od.strabisme}
                            onCheckedChange={(checked) => handleClinicalChange("od", "strabisme", checked === true)}
                            disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="strabisme_od">Strabisme</Label>
                            {clinicalData.od.strabisme && (
                            <Select
                                value={clinicalData.od.strabisme_cote}
                                onValueChange={(value) => handleClinicalChange("od", "strabisme_cote", value)}
                                disabled={!canEditClinical}
                            >
                                <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="od">OD</SelectItem>
                                <SelectItem value="og">OG</SelectItem>
                                <SelectItem value="odg">ODG</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        </div>
                        </div>
                        <div className="flex items-start space-x-2">
                        <Checkbox
                            id="strabisme_od"
                            checked={clinicalData.od.nystagmus}
                            onCheckedChange={(checked) => handleClinicalChange("od", "nystagmus", checked === true)}
                            disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="nystagmus_od">Nystagmus</Label>
                            {clinicalData.od.nystagmus && (
                            <Select
                                value={clinicalData.od.nystagmus_cote}
                                onValueChange={(value) => handleClinicalChange("od", "nystagmus_cote", value)}
                                disabled={!canEditClinical}
                            >
                                <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="od">OD</SelectItem>
                                <SelectItem value="og">OG</SelectItem>
                                <SelectItem value="odg">ODG</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        </div>
                        </div>
                        <div className="flex items-start space-x-2">
                        <Checkbox
                            id="strabisme_od"
                            checked={clinicalData.od.strabisme}
                            onCheckedChange={(checked) => handleClinicalChange("od", "strabisme", checked === true)}
                            disabled={!canEditClinical}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="strabisme_od">Strabisme</Label>
                            {clinicalData.od.strabisme && (
                            <Select
                                value={clinicalData.od.strabisme_cote}
                                onValueChange={(value) => handleClinicalChange("od", "strabisme_cote", value)}
                                disabled={!canEditClinical}
                            >
                                <SelectTrigger className="w-[180px] mt-2">
                                <SelectValue placeholder="Sélectionner un côté" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="od">OD</SelectItem>
                                <SelectItem value="og">OG</SelectItem>
                                <SelectItem value="odg">ODG</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        </div>
                        </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Biomicroscopie (segment antérieur) */}
          <Card>
            <CardHeader>
              <CardTitle>Biomicroscopie (segment antérieur)</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="od" className="w-full">
                <TabsList>
                  <TabsTrigger value="od">OD (œil droit)</TabsTrigger>
                  <TabsTrigger value="og">OG (œil gauche)</TabsTrigger>
                </TabsList>
                <TabsContent value="od">
                  <div className="space-y-2">
                    <ChoiceSelect
                      name="cornee_od"
                      label="Cornée"
                      options={choicesMap.Cornee}
                      value={clinicalData.od.cornee}
                      onChange={(val) => handleClinicalChange("od", "cornee", val)}
                      multiple={false}
                    />
                    <ChoiceSelect
                      name="transparence_od"
                      label="Transparence"
                      value={clinicalData.od.transparence}
                      options={choicesMap.ChambreAnterieureTransparence}
                      onChange={(value) => handleClinicalChange("od", "transparence", value)}
                      multiple={false}
                    />
                    <ChoiceSelect
                      name="iris_od"
                      label="Iris"
                      options={choicesMap.Iris}
                      value={clinicalData.od.iris}
                      onChange={(val) => handleClinicalChange("od", "iris", val)}
                      multiple={false}
                    />
                    <ChoiceSelect
                      name="cristallin_od"
                      label="Cristallin"
                      options={choicesMap.Cristallin}
                      value={clinicalData.od.cristallin}
                      onChange={(val) => handleClinicalChange("od", "cristallin", val)}
                      multiple={false}
                    />
                    <ChoiceSelect
                      name="pupille_od"
                      label="Pupille"
                      options={choicesMap.Pupille}
                      value={clinicalData.od.pupille}
                      onChange={(val) => handleClinicalChange("od", "pupille", val)}
                      multiple={false}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="og">
                  <div className="space-y-2">
                    <ChoiceSelect
                      name="cornee_og"
                      label="Cornée"
                      options={choicesMap.Cornee}
                      value={clinicalData.og.cornee}
                      onChange={(val) => handleClinicalChange("og", "cornee", val)}
                      multiple={false}
                    />
                    <ChoiceSelect
                      name="transparence_og"
                      label="Transparence"
                      value={clinicalData.og.transparence}
                      options={choicesMap.ChambreAnterieureTransparence}
                      onChange={(value) => handleClinicalChange("og", "transparence", value)}
                      multiple={false}
                    />
                    <ChoiceSelect
                      name="iris_og"
                      label="Iris"
                      options={choicesMap.Iris}
                      value={clinicalData.og.iris}
                      onChange={(val) => handleClinicalChange("og", "iris", val)}
                      multiple={false}
                    />
                    <ChoiceSelect
                      name="cristallin_og"
                      label="Cristallin"
                      options={choicesMap.Cristallin}
                      value={clinicalData.og.cristallin}
                      onChange={(val) => handleClinicalChange("og", "cristallin", val)}
                      multiple={false}
                    />
                    <ChoiceSelect
                      name="pupille_og"
                      label="Pupille"
                      options={choicesMap.Pupille}
                      value={clinicalData.og.pupille}
                      onChange={(val) => handleClinicalChange("og", "pupille", val)}
                      multiple={false}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Biomicroscopie (segment postérieur) */}
          <Card>
            <CardHeader>
              <CardTitle>Biomicroscopie (segment postérieur)</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="od" className="w-full">
                <TabsList>
                  <TabsTrigger value="od">OD (œil droit)</TabsTrigger>
                  <TabsTrigger value="og">OG (œil gauche)</TabsTrigger>
                </TabsList>
                <TabsContent value="od">
                  <div className="space-y-2">
                        <Label htmlFor="retine_od" className="text-base font-medium">
                            Rétine
                        </Label>
                        <Input
                        id="retine_od"
                        type="number" 
                        />
                    </div>
                  <div className="space-y-2">
                        <Label htmlFor="C/D OD" className="text-base font-medium">
                            C/D OD
                        </Label>
                        <Input
                        id="retineC/D OD_od"
                        type="number" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="space-y-2">
                        <ChoiceSelect
                            name="retinien_peripherique"
                            label="Champ rétinien"
                            options={choicesMap.ChampRetinienPeripherique}
                            value={''}
                            onChange={() => null}
                            multiple={false}
                        />
                        </div>

                        <div className="space-y-2">
                        <ChoiceSelect
                            name="vitre"
                            label="Vitré"
                            options={choicesMap.Vitre}
                            value={''}
                            onChange={() => null}
                            multiple={false}
                        />
                        </div>

                        <div className="space-y-2">
                        <ChoiceSelect
                            name="vaisseaux"
                            label="Vaisseaux"
                            options={choicesMap.Vaisseaux}
                            value={''}
                            onChange={() => null}
                            multiple={false}
                        />
                        </div>

                        <div className="space-y-2">
                        <ChoiceSelect
                            name="papille"
                            label="Papille"
                            options={choicesMap.Papille}
                            value={''}
                            onChange={() => null}
                            multiple={false}
                        />
                        </div>

                        <div className="space-y-2">
                        <ChoiceSelect
                            name="macula"
                            label="Macula"
                            options={choicesMap.Macula}
                            value={''}
                            onChange={() => null}
                            multiple={false}
                        />
                    </div>
                    </div>
                </TabsContent>
                <TabsContent value="og">
                  <div className="space-y-2">
                        <Label htmlFor="retine_og" className="text-base font-medium">
                            Rétine
                        </Label>
                        <Input
                        id="retine_og"
                        type="number" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="C/D OG" className="text-base font-medium">
                            C/D OG
                        </Label>
                        <Input
                        id="retineC/D OD_od"
                        type="number" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="space-y-2">
                        <ChoiceSelect
                            name="retinien_peripherique"
                            label="Champ rétinien"
                            options={choicesMap.ChampRetinienPeripherique}
                            value={''}
                            onChange={() => null}
                            multiple={false}
                        />
                        </div>

                        <div className="space-y-2">
                        <ChoiceSelect
                            name="vitre"
                            label="Vitré"
                            options={choicesMap.Vitre}
                            value={''}
                            onChange={() => null}
                            multiple={false}
                        />
                        </div>

                        <div className="space-y-2">
                        <ChoiceSelect
                            name="vaisseaux"
                            label="Vaisseaux"
                            options={choicesMap.Vaisseaux}
                            value={''}
                            onChange={() => null}
                            multiple={false}
                        />
                        </div>

                        <div className="space-y-2">
                        <ChoiceSelect
                            name="papille"
                            label="Papille"
                            options={choicesMap.Papille}
                            value={''}
                            onChange={() => null}
                            multiple={false}
                        />
                        </div>

                        <div className="space-y-2">
                        <ChoiceSelect
                            name="macula"
                            label="Macula"
                            options={choicesMap.Macula}
                            value={''}
                            onChange={() => null}
                            multiple={false}
                        />
                    </div>
                    </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        {/* Examens complémentaires */}
        <Card>
        <CardHeader>
            <CardTitle>Biomicroscopie (Examens complémentaires)</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="insertion_images">Rétinographie</Label>
                    <Input
                    id="insertion_images"
                    type="file"
                    multiple
                    onChange={(e) => handleClinicalChange("od", "insertion_images", e.target.files)}
                    disabled={!canEditClinical}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="insertion_images">OCT</Label>
                    <Input
                    id="insertion_images"
                    type="file"
                    multiple
                    onChange={(e) => handleClinicalChange("od", "insertion_images", e.target.files)}
                    disabled={!canEditClinical}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="autres">Autres</Label>
                    <Input
                    id="autres"
                    type="file"
                    multiple
                    onChange={(e) => handleClinicalChange("od", "insertion_images", e.target.files)}
                    disabled={!canEditClinical}
                    />
                </div>
            </div>
        </CardContent>
        </Card>
          {/* Périmétrie */}
          <Card>
            <CardHeader>
              <CardTitle>Périmétrie</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="limite_sup_og">Limite supérieure</Label>
                        <Input
                        id="limite_sup_og"
                        value={clinicalData.og.limite_sup}
                        onChange={(e) => handleClinicalChange("og", "limite_sup", e.target.value)}
                        disabled={!canEditClinical}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="limite_inf_og">Limite inférieure</Label>
                        <Input
                        id="limite_inf_og"
                        value={clinicalData.og.limite_inf}
                        onChange={(e) => handleClinicalChange("og", "limite_inf", e.target.value)}
                        disabled={!canEditClinical}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="limite_temp_droit_og">Limite temporale droit</Label>
                        <Input
                        id="limite_temp_droit_og"
                        value={clinicalData.og.limite_temp_droit}
                        onChange={(e) => handleClinicalChange("og", "limite_temp_droit", e.target.value)}
                        disabled={!canEditClinical}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="limite_temp_gauche_og">Limite temporale gauche</Label>
                        <Input
                        id="limite_temp_gauche_og"
                        value={clinicalData.og.limite_temp_gauche}
                        onChange={(e) => handleClinicalChange("og", "limite_temp_gauche", e.target.value)}
                        disabled={!canEditClinical}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="limite_horizontal_og">Limite horizontale</Label>
                        <Input
                        id="limite_horizontal_og"
                        value={clinicalData.og.limite_horizontal}
                        onChange={(e) => handleClinicalChange("og", "limite_horizontal", e.target.value)}
                        disabled={!canEditClinical}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="score_esterman_og">Score d'Esterman</Label>
                        <Input
                        id="score_esterman_og"
                        value={clinicalData.og.score_esterman}
                        onChange={(e) => handleClinicalChange("og", "score_esterman", e.target.value)}
                        disabled={!canEditClinical}
                        />
                    </div>
                    <ChoiceSelect
                        label="Périmètre binoculaire"
                        name="perimetre_binoculaire_og"
                        options={choicesMap.HypotonisantValue}
                        value={clinicalData.og.perimetre_binoculaire}
                        onChange={(value) => handleClinicalChange("og", "perimetre_binoculaire", value)}
                        multiple={false}
                    />
                </div>
                <div className="space-y-2 mt-4">
                    <Label htmlFor="autres">Périmétrie Binoculaire</Label>
                    <Input
                    id="autres"
                    type="file"
                    multiple
                    onChange={(e) => handleClinicalChange("od", "insertion_images", e.target.files)}
                    disabled={!canEditClinical}
                    />
                </div>
                <div className="space-y-2 mt-2">
                    <Label htmlFor="autres">Images</Label>
                    <Input
                    id="autres"
                    type="file"
                    multiple
                    onChange={(e) => handleClinicalChange("od", "insertion_images", e.target.files)}
                    disabled={!canEditClinical}
                    />
                </div>
            </CardContent>
          </Card>

          {/* Conclusion */}
          <Card>
            <CardHeader>
              <CardTitle>Conclusion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ChoiceSelect
                name="vison_compatibility"
                label="Comptabilité de la vision"
                options={choicesMap.CompatibiliteChoices}
                value={clinicalData.conclusion_conduite}
                onChange={(val) => handleClinicalChange("od", "conclusion_conduite", val)}
                multiple={false}
              />
              <ChoiceSelect
                name="vison_compatibility"
                label="Vehicule à Moteur"
                options={choicesMap.TypeVehicule}
                value={clinicalData.conclusion_conduite}
                onChange={(val) => handleClinicalChange("od", "conclusion_conduite", val)}
                multiple={false}
              />
              <ChoiceSelect
                name="vison_compatibility"
                label="RV"
                options={choicesMap.RV}
                value={clinicalData.conclusion_conduite}
                onChange={(val) => handleClinicalChange("od", "conclusion_conduite", val)}
                multiple={false}
              />
              <div className="space-y-2">
                <Label htmlFor="cat">CAT</Label>
                <Textarea
                  id="cat"
                  value={clinicalData.cat}
                  onChange={(e) => handleClinicalChange("od", "cat", e.target.value)}
                  disabled={!canEditClinical}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="traitement">Traitement</Label>
                <Textarea
                  id="traitement"
                  value={clinicalData.traitement}
                  onChange={(e) => handleClinicalChange("od", "traitement", e.target.value)}
                  disabled={!canEditClinical}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observation">Observations</Label>
                <Textarea
                  id="observation"
                  value={clinicalData.observation}
                  onChange={(e) => handleClinicalChange("od", "observation", e.target.value)}
                  disabled={!canEditClinical}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center space-x-2 mt-6">
            <Checkbox
                id="rv"
                checked={clinicalData.rv}
                onCheckedChange={(checked) => handleClinicalChange("od", "rv", checked === true)}
                disabled={!canEditClinical}
            />
            <Label htmlFor="rv">Patient à risque</Label>
        </div>
        {canEditClinical && (
          <div className="flex justify-end mt-4">
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