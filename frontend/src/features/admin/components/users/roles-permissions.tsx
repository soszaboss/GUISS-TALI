import { useState } from "react"
import { ArrowLeft, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

export function AdminRolesPermissions() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<null | { id: number; name: string }>(null)

  // Données pour les rôles
  const roles = [
    {
      id: 1,
      name: "Administrateur",
      description: "Accès complet à toutes les fonctionnalités",
      usersCount: 3,
    },
    {
      id: 2,
      name: "Médecin",
      description: "Accès aux dossiers médicaux et validation des visites",
      usersCount: 12,
    },
    {
      id: 3,
      name: "Technicien",
      description: "Réalisation des examens techniques",
      usersCount: 8,
    },
    {
      id: 4,
      name: "Assistant",
      description: "Gestion des rendez-vous et accueil des patients",
      usersCount: 5,
    },
  ]

  // Données pour les modules et permissions
  const modules = [
    {
      id: 1,
      name: "Patients",
      permissions: ["Voir", "Créer", "Modifier", "Supprimer"],
    },
    {
      id: 2,
      name: "Visites",
      permissions: ["Voir", "Créer", "Modifier", "Supprimer", "Valider"],
    },
    {
      id: 3,
      name: "Utilisateurs",
      permissions: ["Voir", "Créer", "Modifier", "Supprimer"],
    },
    {
      id: 4,
      name: "Paramètres",
      permissions: ["Voir", "Modifier"],
    },
    {
      id: 5,
      name: "Statistiques",
      permissions: ["Voir"],
    },
    {
      id: 6,
      name: "Journal d'activité",
      permissions: ["Voir"],
    },
  ]

  // Permissions par rôle (simulées)
  type RolePermissions = {
    [roleId: number]: {
      [moduleId: number]: string[]
    }
  }

  const rolePermissions: RolePermissions = {
    1: {
      // Admin
      1: ["Voir", "Créer", "Modifier", "Supprimer"], // Patients
      2: ["Voir", "Créer", "Modifier", "Supprimer", "Valider"], // Visites
      3: ["Voir", "Créer", "Modifier", "Supprimer"], // Utilisateurs
      4: ["Voir", "Modifier"], // Paramètres
      5: ["Voir"], // Statistiques
      6: ["Voir"], // Journal d'activité
    },
    2: {
      // Médecin
      1: ["Voir", "Créer", "Modifier"], // Patients
      2: ["Voir", "Créer", "Modifier", "Valider"], // Visites
      3: [], // Utilisateurs
      4: [], // Paramètres
      5: ["Voir"], // Statistiques
      6: [], // Journal d'activité
    },
    3: {
      // Technicien
      1: ["Voir"], // Patients
      2: ["Voir", "Créer", "Modifier"], // Visites
      3: [], // Utilisateurs
      4: [], // Paramètres
      5: [], // Statistiques
      6: [], // Journal d'activité
    },
    4: {
      // Assistant
      1: ["Voir", "Créer", "Modifier"], // Patients
      2: ["Voir", "Créer"], // Visites
      3: [], // Utilisateurs
      4: [], // Paramètres
      5: [], // Statistiques
      6: [], // Journal d'activité
    },
  }

  const handleEditRole = (role: { id: number; name: string }) => {
    setCurrentRole(role)
    setIsEditDialogOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/admin/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Rôles et permissions</h1>
            <p className="text-gray-500 mt-1">Gérez les rôles et leurs permissions associées</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un rôle
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{role.name}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-2">{role.usersCount} utilisateurs avec ce rôle</div>
                <div className="space-y-2">
                  {modules.slice(0, 3).map((module) => (
                    <div key={module.id} className="flex items-center justify-between">
                      <span>{module.name}</span>
                      <div className="flex space-x-1">
                        {rolePermissions[role.id][module.id].map((permission) => (
                          <span
                            key={permission}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" size="sm" className="mt-2 p-0" asChild>
                  <Link to={`/admin/users/roles/${role.id}`}>Voir toutes les permissions</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Matrice des permissions</CardTitle>
            <CardDescription>Vue d'ensemble des permissions par rôle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Module / Permission</TableHead>
                    {roles.map((role) => (
                      <TableHead key={role.id}>{role.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell className="font-medium">{module.name}</TableCell>
                      {roles.map((role) => (
                        <TableCell key={role.id}>
                          <div className="flex flex-wrap gap-1">
                            {rolePermissions[role.id][module.id].map((permission) => (
                              <span
                                key={permission}
                                className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogue d'édition de rôle */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le rôle {currentRole?.name}</DialogTitle>
            <DialogDescription>Modifiez les informations et les permissions de ce rôle</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Nom du rôle</Label>
                <Input id="roleName" defaultValue={currentRole?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription">Description</Label>
                <Input id="roleDescription" defaultValue={roles.find((r) => r.id === currentRole?.id)?.description} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Permissions</h3>
              {modules.map((module) => (
                <div key={module.id} className="border p-4 rounded-md">
                  <h4 className="font-medium mb-3">{module.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {module.permissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${module.id}-${permission}`}
                          defaultChecked={
                            !!(currentRole && rolePermissions[currentRole.id][module.id].includes(permission))
                          }
                        />
                        <Label htmlFor={`${module.id}-${permission}`}>{permission}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button>Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'ajout de rôle */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau rôle</DialogTitle>
            <DialogDescription>Créez un nouveau rôle avec des permissions personnalisées</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newRoleName">Nom du rôle</Label>
              <Input id="newRoleName" placeholder="Ex: Superviseur" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newRoleDescription">Description</Label>
              <Input id="newRoleDescription" placeholder="Ex: Supervise les techniciens et valide leur travail" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button>Créer et configurer les permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
