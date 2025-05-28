import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "react-router-dom"

export function AdminUserForm() {
  const [generatePassword, setGeneratePassword] = useState(true)

  return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/admin-platform/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Ajouter un utilisateur</h1>
        </div>

        <Tabs defaultValue="basic-info" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="basic-info">Informations de base</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info">
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
                <CardDescription>Entrez les informations de l'utilisateur</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" placeholder="Prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" placeholder="Nom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@exemple.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" placeholder="+33 6 12 34 56 78" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="doctor">Médecin</SelectItem>
                        <SelectItem value="technician">Technicien</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select defaultValue="active">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Mot de passe</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="generatePassword">Générer un mot de passe</Label>
                      <p className="text-sm text-gray-500">
                        Un mot de passe temporaire sera généré et envoyé à l'utilisateur par email
                      </p>
                    </div>
                    <Switch id="generatePassword" checked={generatePassword} onCheckedChange={setGeneratePassword} />
                  </div>
                  {!generatePassword && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input id="password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Définissez les permissions de l'utilisateur</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Gestion des patients</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="patients-view" />
                        <Label htmlFor="patients-view">Voir les patients</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="patients-create" />
                        <Label htmlFor="patients-create">Créer des patients</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="patients-edit" />
                        <Label htmlFor="patients-edit">Modifier les patients</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="patients-delete" />
                        <Label htmlFor="patients-delete">Supprimer des patients</Label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Gestion des visites</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="visits-view" />
                        <Label htmlFor="visits-view">Voir les visites</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="visits-create" />
                        <Label htmlFor="visits-create">Créer des visites</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="visits-edit" />
                        <Label htmlFor="visits-edit">Modifier les visites</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="visits-delete" />
                        <Label htmlFor="visits-delete">Supprimer des visites</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="visits-validate" />
                        <Label htmlFor="visits-validate">Valider les visites</Label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Administration</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="admin-users" />
                        <Label htmlFor="admin-users">Gérer les utilisateurs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="admin-settings" />
                        <Label htmlFor="admin-settings">Modifier les paramètres</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="admin-logs" />
                        <Label htmlFor="admin-logs">Voir les journaux d'activité</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="admin-stats" />
                        <Label htmlFor="admin-stats">Voir les statistiques</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link to="/admin-platform/users">Annuler</Link>
          </Button>
          <Button>Créer l'utilisateur</Button>
        </div>
      </div>
  )
}
