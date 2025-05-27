import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Mail, Phone, AlertTriangle, Calendar, User, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the Message type
interface Message {
  id: string
  timestamp: string
  messageType: "appointment" | "urgent"
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

interface MessagesListProps {
  refreshTrigger: number
}

export function MessagesList({ refreshTrigger }: MessagesListProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    // Load messages from localStorage
    const storedMessages = localStorage.getItem("patientMessages")
    if (storedMessages) {
      const parsedMessages = JSON.parse(storedMessages) as Message[]
      setMessages(parsedMessages)
      setFilteredMessages(parsedMessages)
    }
  }, [refreshTrigger])

  // Filter messages when filters change
  useEffect(() => {
    let result = [...messages]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (message) =>
          message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply type filter
    if (filterType !== "all") {
      result = result.filter((message) => message.messageType === filterType)
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((message) => message.status === filterStatus)
    }

    setFilteredMessages(result)
  }, [messages, searchTerm, filterType, filterStatus])

  const getRecipientText = (message: Message) => {
    switch (message.recipients.type) {
      case "individual":
        return "Un patient"
      case "multiple":
        return `${message.recipients.count} patients`
      case "all":
        return "Tous les patients"
      default:
        return "Inconnu"
    }
  }

  const getRecipientIcon = (message: Message) => {
    switch (message.recipients.type) {
      case "individual":
        return <User className="h-4 w-4" />
      case "multiple":
      case "all":
        return <Users className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: Message["status"]) => {
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

  if (messages.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500">Aucun message envoyé</h3>
        <p className="text-gray-400 mt-1">Créez votre premier message en utilisant l'onglet "Nouveau message"</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1">
          <Input
            placeholder="Rechercher des messages..."
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
              <SelectItem value="urgent">Urgent</SelectItem>
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
        {filteredMessages.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-500">Aucun message trouvé</h3>
            <p className="text-gray-400 mt-1">Modifiez vos critères de recherche</p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className={`${message.urgent ? "border-l-4 border-l-red-500" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <CardTitle className="flex items-center">
                      {message.subject}
                      {message.urgent && (
                        <Badge variant="destructive" className="ml-2">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mt-1 flex-wrap gap-2">
                      <span className="flex items-center">
                        {message.messageType === "appointment" ? (
                          <Calendar className="h-4 w-4 mr-1" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 mr-1" />
                        )}
                        {message.messageType === "appointment" ? "Rappel de rendez-vous" : "Message urgent"}
                      </span>
                      <span className="text-gray-300 mx-2">•</span>
                      <span className="flex items-center">
                        {getRecipientIcon(message)}
                        <span className="ml-1">{getRecipientText(message)}</span>
                      </span>
                      <span className="text-gray-300 mx-2">•</span>
                      <span>
                        Envoyé le {format(new Date(message.timestamp), "d MMMM yyyy à HH:mm", { locale: fr })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(message.status)}
                    <div className="flex items-center gap-1">
                      {message.channels.email && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Badge>
                      )}
                      {message.channels.sms && (
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
                <p className="whitespace-pre-line text-gray-700">{message.message}</p>

                {message.messageType === "appointment" && message.appointmentDate && (
                  <div className="mt-4 text-sm flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date du rendez-vous: {format(new Date(message.appointmentDate), "d MMMM yyyy", { locale: fr })}
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
