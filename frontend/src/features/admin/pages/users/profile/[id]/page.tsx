import { ArrowLeft, Edit, Mail, Phone, Calendar, MapPin, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"

const userId = "12345" // Remplacez par l'ID de l'utilisateur à afficher
export default function AdminUserProfile() {
  // Données de démonstration pour l'utilisateur
  const user = {
    id: userId,
    name: "Dr. Jean Martin",
    email: "jean.martin@example.com",
    phone: "+33 1 23 45 67 89",
    role: "Médecin",
    status: "active",
    avatar: "/placeholder.svg?height=100&width=100",
    createdAt: "15 janvier 2023",
    lastLogin: "Aujourd'hui, 10:30",
    address: "123 Rue de la Santé, 75014 Paris",
    speciality: "Cardiologie",
    license: "MD-123456789",
    department: "Service de Cardiologie",
    permissions: ["Consulter patients", "Modifier dossiers", "Prescrire médicaments", "Accès urgences"],
    stats: {
      totalPatients: 245,
      appointmentsThisMonth: 67,
      consultationsCompleted: 1234,
      averageRating: 4.8,
    },
  }

  return (
      <div className="space-y-6">
        {/* En-tête avec navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/users">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Profil utilisateur</h1>
              <p className="text-gray-500">Détails et informations de l'utilisateur</p>
            </div>
          </div>
          <Button asChild>
            <Link to={`/admin/users/edit/${userId}`}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-gray-500">{user.speciality}</p>
                    <Badge className={user.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                      {user.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{user.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span>Licence: {user.license}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations professionnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rôle</label>
                    <p className="text-lg">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Département</label>
                    <p className="text-lg">{user.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date de création</label>
                    <p className="text-lg flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {user.createdAt}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dernière connexion</label>
                    <p className="text-lg flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {user.lastLogin}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline">
                      {permission}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" asChild>
                    <Link to={`/admin/users/permissions/${userId}`}>Gérer les permissions</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.stats.totalPatients}</div>
                  <div className="text-sm text-gray-500">Patients total</div>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{user.stats.appointmentsThisMonth}</div>
                  <div className="text-sm text-gray-500">RDV ce mois</div>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.stats.consultationsCompleted}</div>
                  <div className="text-sm text-gray-500">Consultations</div>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{user.stats.averageRating}/5</div>
                  <div className="text-sm text-gray-500">Note moyenne</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/admin/users/edit/${userId}`}>Modifier le profil</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/admin/users/permissions/${userId}`}>Gérer permissions</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Réinitialiser mot de passe
                </Button>
                <Button variant="destructive" className="w-full">
                  Désactiver compte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
