"use client"

import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"

interface AssistantSidebarProps {
  open: boolean
  onClose: () => void
}

export function AssistantSidebar({ open, onClose }: AssistantSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname
  const  user  = {
    name: "Assistant",
    email: "assistant@email.com",
    avatar: "/placeholder.svg", // Chemin vers l'avatar par défaut
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <>
      {/* Overlay pour mobile */}
      {open && <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" onClick={onClose}></div>}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Logo et titre */}
            <div className="flex items-center justify-between p-4 border-b py-[6.9%]">
              <Link to="/assistant" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-blue-600">GUISS TALI</span>
              </Link>
              <button onClick={onClose} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="overflow-y-auto p-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/assistant"
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActive("/assistant") && !isActive("/assistant/patients") && !isActive("/assistant/appointments")
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>Tableau de bord</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/assistant/patients"
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActive("/assistant/patients") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>Patients</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/assistant/appointments"
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActive("/assistant/appointments")
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Rendez-vous</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/assistant/notifications"
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActive("/assistant/notifications")
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span>Notifications</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Profil utilisateur - maintenant en bas */}
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name || "Assistant"}</p>
                <p className="text-sm text-gray-500">{user?.email || "assistant@doccure.com"}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
