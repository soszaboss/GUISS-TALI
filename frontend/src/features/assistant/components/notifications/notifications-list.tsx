import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Mail, Phone, AlertTriangle, Calendar, User, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the Notification type
interface Notification {
  id: string
  timestamp: string
  notificationType: "appointment" | "urgent" | "general"
  subject: string
  message: string
  recipients: {
    type: "individual" | "multiple" | "all"
    count: number
    patientId: string | null
  }
  channels: {
    email: boolean
    sms: boolean
  }
  urgent: boolean
  appointmentDate: string | null
  sendDate: string
  status: "sent" | "scheduled" | "failed"
}

interface NotificationsListProps {
  refreshTrigger: number
}

export function NotificationsList({ refreshTrigger }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    // Load notifications from localStorage
    const storedNotifications = localStorage.getItem("patientNotifications")
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications) as Notification[]
      setNotifications(parsedNotifications)
      setFilteredNotifications(parsedNotifications)
    }
  }, [refreshTrigger])

  // Filter notifications when filters change
  useEffect(() => {
    let result = [...notifications]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (notification) =>
          notification.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply type filter
    if (filterType !== "all") {
      result = result.filter((notification) => notification.notificationType === filterType)
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((notification) => notification.status === filterStatus)
    }

    setFilteredNotifications(result)
  }, [notifications, searchTerm, filterType, filterStatus])

  const getRecipientText = (notification: Notification) => {
    switch (notification.recipients.type) {
      case "individual":
        return "Un patient"
      case "multiple":
        return `${notification.recipients.count} patients`
      case "all":
        return "Tous les patients"
      default:
        return "Inconnu"
    }
  }

  const getRecipientIcon = (notification: Notification) => {
    switch (notification.recipients.type) {
      case "individual":
        return <User className="h-4 w-4" />
      case "multiple":
      case "all":
        return <Users className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: Notification["status"]) => {
    switch (status) {
      case "sent":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Envoyé
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Programmé
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Échec
          </Badge>
        )
      default:
        return null
    }
  }

  const getNotificationTypeText = (type: Notification["notificationType"]) => {
    switch (type) {
      case "appointment":
        return "Rappel de rendez-vous"
      case "urgent":
        return "Information urgente"
      case "general":
        return "Information générale"
      default:
        return "Inconnu"
    }
  }

  const getNotificationTypeIcon = (type: Notification["notificationType"]) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4 mr-1" />
      case "urgent":
        return <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
      case "general":
        return <Mail className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm w-2/3 mx-auto">
        <h3 className="text-lg font-medium text-black">Aucune notification envoyée</h3>
        <p className="text-gray-800 mt-1">
          Créez votre première notification en utilisant l'onglet "Nouvelle notification"
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1">
          <Input
            placeholder="Rechercher des notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="appointment">Rappel de RDV</SelectItem>
              <SelectItem value="urgent">Information urgente</SelectItem>
              <SelectItem value="general">Information générale</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="sent">Envoyé</SelectItem>
              <SelectItem value="scheduled">Programmé</SelectItem>
              <SelectItem value="failed">Échec</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-500">Aucune notification trouvée</h3>
            <p className="text-gray-400 mt-1">Modifiez vos critères de recherche</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`${notification.urgent ? "border-l-4 border-l-red-500" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <CardTitle className="flex items-center">
                      {notification.subject}
                      {notification.urgent && (
                        <Badge variant="destructive" className="ml-2">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mt-1 flex-wrap gap-2">
                      <span className="flex items-center">
                        {getNotificationTypeIcon(notification.notificationType)}
                        {getNotificationTypeText(notification.notificationType)}
                      </span>
                      <span className="text-gray-300 mx-2">•</span>
                      <span className="flex items-center">
                        {getRecipientIcon(notification)}
                        <span className="ml-1">{getRecipientText(notification)}</span>
                      </span>
                      <span className="text-gray-300 mx-2">•</span>
                      <span>
                        Envoyé le {format(new Date(notification.timestamp), "d MMMM yyyy à HH:mm", { locale: fr })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(notification.status)}
                    <div className="flex items-center gap-1">
                      {notification.channels.email && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Badge>
                      )}
                      {notification.channels.sms && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          <Phone className="h-3 w-3 mr-1" />
                          SMS
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-gray-700">{notification.message}</p>

                {notification.notificationType === "appointment" && notification.appointmentDate && (
                  <div className="mt-4 text-sm flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date du rendez-vous: {format(new Date(notification.appointmentDate), "d MMMM yyyy", { locale: fr })}
                  </div>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <Button size="sm" variant="outline">
                    Voir détails
                  </Button>
                  <Button size="sm" variant="outline">
                    Renvoyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
