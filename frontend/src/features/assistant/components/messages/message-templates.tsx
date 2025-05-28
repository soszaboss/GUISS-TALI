import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, FileText } from "lucide-react"

interface MessageTemplateProps {
  onSelectTemplate: (template: MessageTemplate) => void
}

interface MessageTemplate {
  id: string
  title: string
  description: string
  subject: string
  body: string
  type: "appointment" | "urgent" | "general"
}

// Predefined message templates
const templates: MessageTemplate[] = [
  {
    id: "1",
    title: "Rappel de rendez-vous",
    description: "Rappel standard pour un rendez-vous prochain",
    subject: "Rappel : Votre rendez-vous médical",
    body: "Bonjour,\n\nNous vous rappelons votre rendez-vous médical prévu le [DATE] à [HEURE] avec Dr. [DOCTEUR].\n\nMerci de vous présenter 10 minutes avant l'heure de votre rendez-vous.\n\nCordialement,\nL'équipe médicale",
    type: "appointment",
  },
  {
    id: "2",
    title: "Confirmation de rendez-vous",
    description: "Confirmation d'un rendez-vous nouvellement programmé",
    subject: "Confirmation de votre rendez-vous médical",
    body: "Bonjour,\n\nVotre rendez-vous médical a été confirmé pour le [DATE] à [HEURE] avec Dr. [DOCTEUR].\n\nEn cas d'empêchement, veuillez nous contacter au moins 24 heures à l'avance.\n\nCordialement,\nL'équipe médicale",
    type: "appointment",
  },
  {
    id: "3",
    title: "Résultats disponibles",
    description: "Notification que les résultats d'un test sont disponibles",
    subject: "Vos résultats d'examens sont disponibles",
    body: "Bonjour,\n\nVos résultats d'examens sont maintenant disponibles. Veuillez contacter notre cabinet pour en discuter avec votre médecin ou programmer un rendez-vous de suivi.\n\nCordialement,\nL'équipe médicale",
    type: "general",
  },
  {
    id: "4",
    title: "Annulation de rendez-vous",
    description: "Notification d'annulation d'un rendez-vous",
    subject: "Information importante : Annulation de votre rendez-vous",
    body: "Bonjour,\n\nNous sommes désolés de vous informer que votre rendez-vous du [DATE] à [HEURE] avec Dr. [DOCTEUR] a dû être annulé pour des raisons imprévues.\n\nVeuillez nous contacter au plus vite pour reprogrammer votre rendez-vous.\n\nNous vous prions de nous excuser pour ce désagrément.\n\nCordialement,\nL'équipe médicale",
    type: "urgent",
  },
  {
    id: "5",
    title: "Suivi de traitement",
    description: "Rappel de prise de médicament ou suivi de traitement",
    subject: "Rappel de suivi de votre traitement",
    body: "Bonjour,\n\nCe message est un rappel concernant votre traitement en cours. N'oubliez pas de suivre les instructions de votre médecin et de prendre vos médicaments selon la prescription.\n\nSi vous avez des questions ou des effets secondaires, contactez-nous immédiatement.\n\nCordialement,\nL'équipe médicale",
    type: "general",
  },
]

export function MessageTemplates({ onSelectTemplate }: MessageTemplateProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleSelectTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template.id)
    onSelectTemplate(template)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="gap-2">
          <FileText className="h-4 w-4" />
          Utiliser un modèle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Modèles de messages</DialogTitle>
          <DialogDescription>Choisissez un modèle prédéfini pour votre message</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:border-blue-200 ${
                  selectedTemplate === template.id ? "border-blue-500" : ""
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-1">Objet: {template.subject}</p>
                    <p className="text-gray-500 line-clamp-2">{template.body}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    Utiliser ce modèle
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
