import type React from "react"

import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Link } from "react-router-dom"



export default function AdminUserEdit() {
  const userId = "12345" // Remplacez par l'ID de l'utilisateur à modifier
  const [formData, setFormData] = useState({
    name: "Dr. Jean Martin",
    email: "jean.martin@example.com",
    phone: "+33 1 23 45 67 89",
    role: "médecin",
    status: "active",
    address: "123 Rue de la Santé, 75014 Paris",
    speciality: "Cardiologie",
    license: "MD-123456789",
    department: "Service de Cardiologie",
    bio: "Cardiologue expérimenté avec plus de 15 ans d'expérience dans le traitement des maladies cardiovasculaires.",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Données mises à jour:", formData)
    // Logique de sauvegarde ici
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              <Link to={`/admin/users/profile/${userId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Modifier l'utilisateur</h1>
              <p className="text-gray-500">Modifiez les informations de l'utilisateur</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1" htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="phone">Téléphone</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informations professionnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations professionnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2">
                  <div>
                    <Label className="mb-1" htmlFor="role">Rôle</Label>
                    <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrateur">Administrateur</SelectItem>
                        <SelectItem value="médecin">Médecin</SelectItem>
                        <SelectItem value="technicien">Technicien</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="status">Statut</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="mb-1" htmlFor="speciality">Spécialité</Label>
                  <Input
                    id="speciality"
                    value={formData.speciality}
                    onChange={(e) => handleChange("speciality", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="license">Numéro de licence</Label>
                  <Input
                    id="license"
                    value={formData.license}
                    onChange={(e) => handleChange("license", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link to={`/admin/users/profile/${userId}`}>Annuler</Link>
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </form>
      </div>
  )
}
