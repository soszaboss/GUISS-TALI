import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import { Home, Users, AlertTriangle } from "lucide-react"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`min-h-screen fixed top-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Logo et titre */}
            <div className="flex items-center justify-between p-4 border-b py-[6.9%]">
              <Link to="/" className="flex items-center space-x-2">
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
                    to="/"
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActive("/employee")
                          && !isActive("/employee/patients")
                          && !isActive("/employee/at-risk-patients")
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span>Tableau de bord</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/employee/patients"
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActive("/employee/patients") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>Patients</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/employee/at-risk-patients"
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActive("/employee/at-risk-patients") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span>Patients à risque</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </>
  )
}