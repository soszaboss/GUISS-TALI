import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface VehicleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vehicle: any) => void
}

export function VehicleModal({ isOpen, onClose, onSave }: VehicleModalProps) {
  const [formData, setFormData] = useState({
    immatriculation: "",
    modele: "",
    annee: "",
    type: "Voiture",
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({ immatriculation: "", modele: "", annee: "", type: "Voiture" })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ajouter un véhicule</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Immatriculation</label>
            <input
              type="text"
              value={formData.immatriculation}
              onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Modèle</label>
            <input
              type="text"
              value={formData.modele}
              onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Année</label>
            <input
              type="number"
              value={formData.annee}
              onChange={(e) => setFormData({ ...formData, annee: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="Voiture">Voiture</option>
              <option value="Moto">Moto</option>
              <option value="Camion">Camion</option>
              <option value="Bus">Bus</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
