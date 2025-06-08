import type React from "react"

import { useState } from "react"
import { ArrowLeft, Save, Shield, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

const userId = "12345" // Remplacez par l'ID de l'utilisateur à modifier
export function AdminUserPermissions() {
  const [permissions, setPermissions] = useState({
    // Gestion des patients
    patients_view: true,
    patients_create: true,
    patients_edit: true,
    patients_delete: false,

    // Gestion des dossiers médicaux
    medical_records_view: true,
    medical_records_create: true,
    medical_records_edit: true,
    medical_records_delete: false,

    // Gestion des rendez-vous
    appointments_view: true,
    appointments_create: true,
    appointments_edit: true,
    appointments_delete: false,

    // Gestion des utilisateurs
    users_view: false,
    users_create: false,
    users_edit: false,
    users_delete: false,

    // Administration
    admin_dashboard: false,
    admin_settings: false,
    admin_logs: false,
    admin_reports: false,

    // Fonctionnalités spéciales
    prescriptions: true,
    emergency_access: true,
    export_data: false,
    system_backup: false,
  })

  const user = {
    name: "Dr. Jean Martin",
    role: "Médecin",
    email: "jean.martin@example.com",
  }

  const permissionGroups = [
    {
      title: "Gestion des patients",
      permissions: [
        { key: "patients_view", label: "Consulter les patients" },
        { key: "patients_create", label: "Créer des patients" },
        { key: "patients_edit", label: "Modifier les patients" },
        { key: "patients_delete", label: "Supprimer les patients" },
      ],
    },
    {
      title: "Dossiers médicaux",
      permissions: [
        { key: "medical_records_view", label: "Consulter les dossiers" },
        { key: "medical_records_create", label: "Créer des dossiers" },
        { key: "medical_records_edit", label: "Modifier les dossiers" },
        { key: "medical_records_delete", label: "Supprimer les dossiers" },
      ],
    },
    {
      title: "Rendez-vous",
      permissions: [
        { key: "appointments_view", label: "Consulter les RDV" },
        { key: "appointments_create", label: "Créer des RDV" },
        { key: "appointments_edit", label: "Modifier les RDV" },
        { key: "appointments_delete", label: "Supprimer les RDV" },
      ],
    },
    {
      title: "Gestion des utilisateurs",
      permissions: [
        { key: "users_view", label: "Consulter les utilisateurs" },
        { key: "users_create", label: "Créer des utilisateurs" },
        { key: "users_edit", label: "Modifier les utilisateurs" },
        { key: "users_delete", label: "Supprimer les utilisateurs" },
      ],
    },
    {
      title: "Administration",
      permissions: [
        { key: "admin_dashboard", label: "Tableau de bord admin" },
        { key: "admin_settings", label: "Paramètres système" },
        { key: "admin_logs", label: "Journaux d'activité" },
        { key: "admin_reports", label: "Rapports système" },
      ],
    },
    {
      title: "Fonctionnalités spéciales",
      permissions: [
        { key: "prescriptions", label: "Prescrire des médicaments" },
        { key: "emergency_access", label: "Accès d'urgence" },
        { key: "export_data", label: "Exporter des données" },
        { key: "system_backup", label: "Sauvegardes système" },
      ],
    },
  ]

  const handlePermissionChange = (permissionKey: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionKey]: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Permissions mises à jour:", permissions)
    // Logique de sauvegarde ici
  }

  const getActivePermissionsCount = () => {
    return Object.values(permissions).filter(Boolean).length
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
              <h1 className="text-2xl font-bold tracking-tight">Gestion des permissions</h1>
              <p className="text-gray-500">Configurez les permissions pour {user.name}</p>
            </div>
          </div>
        </div>

        {/* Informations utilisateur */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-500">
                  {user.role} • {user.email}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Check className="h-4 w-4 mr-1" />
                  {getActivePermissionsCount()} permissions actives
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Groupes de permissions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {permissionGroups.map((group, groupIndex) => (
              <Card key={groupIndex}>
                <CardHeader>
                  <CardTitle className="text-lg">{group.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {group.permissions.map((permission, permIndex) => (
                    <div key={permission.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.key}
                        checked={permissions[permission.key as keyof typeof permissions]}
                        onCheckedChange={(checked) => handlePermissionChange(permission.key, checked as boolean)}
                      />
                      <Label htmlFor={permission.key} className="text-sm font-normal cursor-pointer">
                        {permission.label}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link to={`/admin/users/profile/${userId}`}>Annuler</Link>
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les permissions
            </Button>
          </div>
        </form>
      </div>
  )
}
