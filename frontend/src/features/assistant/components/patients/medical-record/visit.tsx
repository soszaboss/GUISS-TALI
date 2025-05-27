"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TechnicalExamination } from "./technical-examination"
import { ClinicalExamination } from "./clinical-examination"
import { Stethoscope, Eye } from "lucide-react"

interface VisitProps {
  visitNumber: number
  patientId: string
  userRole: string
  colorClass: string
  date: string
}

export function Visit({ visitNumber, patientId, userRole, colorClass, date }: VisitProps) {
  const [activeTab, setActiveTab] = useState("technical")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${colorClass.replace("border-", "text-")}`}>
          Visite {visitNumber} - {formatDate(date)}
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="technical" className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Examen Technique
          </TabsTrigger>
          <TabsTrigger value="clinical" className="flex items-center">
            <Stethoscope className="h-4 w-4 mr-2" />
            Examen Clinique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Examen Technique</CardTitle>
            </CardHeader>
            <CardContent>
              <TechnicalExamination visitId={`visite-${visitNumber}`} patientId={patientId} userRole={userRole} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinical">
          <Card>
            <CardHeader>
              <CardTitle>Examen Clinique</CardTitle>
            </CardHeader>
            <CardContent>
              <ClinicalExamination visitId={`visite-${visitNumber}`} patientId={patientId} userRole={userRole} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
