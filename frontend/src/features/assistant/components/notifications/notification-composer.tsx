import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Check, Mail, Phone, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { NotificationTemplates } from "./notification-templates"

// Define form schema
const notificationFormSchema = z.object({
  notificationType: z.enum(["appointment", "urgent", "general"]),
  recipients: z.enum(["individual", "multiple", "all"]),
  patientId: z
    .string()
    .optional()
    .refine((val) => val && val.length > 0, {
      message: "Veuillez sélectionner un patient",
      path: ["patientId"],
    })
    .or(z.literal("")),
  subject: z.string().min(3, { message: "L'objet doit contenir au moins 3 caractères" }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" }),
  sendEmail: z.boolean().default(true),
  sendSms: z.boolean().default(true),
  appointmentDate: z.date().optional(),
  sendDate: z.date().optional(),
  urgent: z.boolean().default(false),
})

type NotificationFormValues = z.infer<typeof notificationFormSchema>

// Sample patients data
const patients = [
  { id: "1", name: "Jean Dupont", email: "jean.dupont@example.com", phone: "+33123456789" },
  { id: "2", name: "Marie Martin", email: "marie.martin@example.com", phone: "+33123456790" },
  { id: "3", name: "Pierre Durand", email: "pierre.durand@example.com", phone: "+33123456791" },
  { id: "4", name: "Sophie Lefebvre", email: "sophie.lefebvre@example.com", phone: "+33123456792" },
  { id: "5", name: "Lucas Bernard", email: "lucas.bernard@example.com", phone: "+33123456793" },
]

interface NotificationComposerProps {
  onNotificationSent: () => void
}

export function NotificationComposer({ onNotificationSent }: NotificationComposerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<(typeof patients)[0] | null>(null)
  const [previewText, setPreviewText] = useState("")

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      notificationType: "appointment",
      recipients: "individual",
      patientId: "",
      subject: "",
      message: "",
      sendEmail: true,
      sendSms: true,
      urgent: false,
    },
  })

  const notificationType = form.watch("notificationType")
  const recipients = form.watch("recipients")
  const patientId = form.watch("patientId")
  const message = form.watch("message")
  const sendEmail = form.watch("sendEmail")
  const sendSms = form.watch("sendSms")
  const urgent = form.watch("urgent")

  // Update selected patient whenever patientId changes
  useEffect(() => {
    if (patientId) {
      const patient = patients.find((p) => p.id === patientId) || null
      setSelectedPatient(patient)
    } else {
      setSelectedPatient(null)
    }
  }, [patientId])

  // Update preview text whenever message changes
  useEffect(() => {
    setPreviewText(message)
  }, [message])

  // Add this function to handle template selection
  const handleTemplateSelect = (template: any) => {
    form.setValue("subject", template.subject)
    form.setValue("message", template.body)
    form.setValue("notificationType", template.type)

    // Update UI
    setPreviewText(template.body)
  }

  async function onSubmit(data: NotificationFormValues) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Process data
      const recipientsCount =
        data.recipients === "individual"
          ? 1
          : data.recipients === "all"
            ? patients.length
            : Math.floor(patients.length / 2)

      // Create notification object
      const newNotification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        notificationType: data.notificationType,
        subject: data.subject,
        message: data.message,
        recipients: {
          type: data.recipients,
          count: recipientsCount,
          patientId: data.patientId || null,
        },
        channels: {
          email: data.sendEmail,
          sms: data.sendSms,
        },
        urgent: data.urgent,
        appointmentDate: data.appointmentDate?.toISOString() || null,
        sendDate: data.sendDate?.toISOString() || new Date().toISOString(),
        status: data.sendDate ? "scheduled" : "sent",
      }

      // Save to localStorage
      const existingNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]")
      localStorage.setItem("patientNotifications", JSON.stringify([newNotification, ...existingNotifications]))

      // Show success message
      setIsSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        form.reset()
        onNotificationSent()
      }, 3000)
    } catch (error) {
      console.error("Error sending notification:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800">Notification envoyée avec succès</AlertTitle>
        <AlertDescription className="text-green-700">
          Votre notification a été {form.getValues("sendDate") ? "programmée" : "envoyée"} avec succès.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Envoyer une notification</CardTitle>
                <CardDescription>
                  Créez et envoyez des notifications personnalisées aux patients par email ou SMS
                </CardDescription>
              </div>
              <NotificationTemplates onSelectTemplate={handleTemplateSelect} />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 ">

              <FormField
                control={form.control}
                name="notificationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de notification</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type de notification" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="appointment">Rappel de rendez-vous</SelectItem>
                        <SelectItem value="urgent">Information urgente</SelectItem>
                        <SelectItem value="general">Information générale</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinataires</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner les destinataires" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual">Patient individuel</SelectItem>
                        <SelectItem value="multiple">Groupe de patients</SelectItem>
                        <SelectItem value="all">Tous les patients</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {recipients === "individual" && (
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {notificationType === "appointment" && (
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date du rendez-vous</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objet de la notification</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez l'objet de la notification" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message personnalisé</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Entrez votre message personnalisé ici..."
                      {...field}
                      className="resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sendEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center space-x-1">
                        <Mail className="h-4 w-4 mr-1" />
                        <span>Envoyer par email</span>
                      </FormLabel>
                      {selectedPatient && <p className="text-xs text-gray-500">{selectedPatient.email}</p>}
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendSms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center space-x-1">
                        <Phone className="h-4 w-4 mr-1" />
                        <span>Envoyer par SMS</span>
                      </FormLabel>
                      {selectedPatient && <p className="text-xs text-gray-500">{selectedPatient.phone}</p>}
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sendDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date d'envoi</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
                          ) : (
                            <span>Envoyer immédiatement</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urgent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                      <span>Notification urgente</span>
                    </FormLabel>
                    <p className="text-xs text-gray-500">
                      Les notifications urgentes sont mises en évidence pour les patients
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Preview section */}
            {previewText && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Aperçu de la notification</h3>
                <div
                  className={`${
                    urgent ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
                  } border rounded-md p-4 text-sm`}
                >
                  <div className="font-medium mb-2">{form.getValues("subject") || "Sans objet"}</div>
                  <p className="whitespace-pre-line">{previewText}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  {sendEmail && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Badge>
                  )}
                  {sendSms && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      <Phone className="h-3 w-3 mr-1" />
                      SMS
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer la notification"}
              </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
