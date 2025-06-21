/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TechnicalExam } from "./TechnicalExam"
import { ClinicalExam } from "./ClinicalExam"
import { DrivingExperience } from "./DrivingExperience"
import { useAuth } from "@/hooks/auth/Auth"
import type { Antecedent as AntecedentModel, DriverExperience} from "@/types/medicalRecord"
import type { ClinicalExamen } from "@/types/examensClinic"
import { initTechnicalData, type TechnicalExamen } from "@/types/examenTechniques"
import { Antecedent } from "./Antecedent"

type extraProps = {
  patientID?: number
  examenID?: number
  visitID?: number
}
type MedicalVisitProps = {
  clinical_examen?: ClinicalExamen
  technical_examen?: TechnicalExamen
  driving_experience?: DriverExperience
  antecedent?: AntecedentModel
  extra?: extraProps
}

export function MedicalVisit({ extra, driving_experience, technical_examen, clinical_examen, antecedent }: MedicalVisitProps) {
  const {currentUser} = useAuth()
  const role = currentUser?.role?.toLocaleLowerCase()
  // Onglet actif
  const [activeTab, setActiveTab] = useState("antecedent")

  // États pour chaque sous-formulaire (adapte selon ta structure)
  const [technicalData] = useState(technical_examen || initTechnicalData)
  const [clinicalData] = useState(clinical_examen || undefined)
  const [drivingData] = useState(driving_experience || undefined)
  const [antecedentData] = useState(antecedent || undefined)

  // États pour l'édition et le statut d'enregistrement
  const canEditTechnical = role === "technician" || role === "admin"
  const canEditClinical = role === "doctor" || role === "admin"
  const canEditDriving = role === "doctor" || role === "admin"
const canEditAntecedent = role === "doctor" || role === "admin"


  return (
    <div className="p-4">
      {/* ... header, workflow, etc ... */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          {/* <TabsTrigger value="history">Antécédents médicaux</TabsTrigger> */}
          <TabsTrigger value="antecedent">Antecedents</TabsTrigger>
          <TabsTrigger value="driving">Expérience de conduite</TabsTrigger>
          <TabsTrigger value="technical">Examen technique</TabsTrigger>
          <TabsTrigger value="clinical">Examen clinique</TabsTrigger>
        </TabsList>
        <TabsContent value="antecedent">
          <Antecedent
            canEdit={canEditAntecedent}
            antecedentData={antecedentData}
          />
        </TabsContent>
        <TabsContent value="driving">
          <DrivingExperience
            driverExperienceData={drivingData}
            canEdit={canEditDriving}
          />
        </TabsContent>
        <TabsContent value="technical">
          <TechnicalExam
            technicalData={technicalData}
            examenID={extra?.examenID}
            visiteID={extra?.visitID}
            patientID={extra?.patientID}
            canEditTechnical={canEditTechnical}
          />
        </TabsContent>
        <TabsContent value="clinical">
          <ClinicalExam
            clinicalData={clinicalData}
            canEditClinical={canEditClinical}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}