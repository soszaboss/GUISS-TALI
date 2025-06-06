import { Calendar, Clock, Users, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DoctorMedicalStats() {
  // Ces données seraient normalement récupérées depuis une API
  const stats = [
    {
      title: "Visites planifiées",
      value: 24,
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600 border-blue-200",
    },
    {
      title: "À finaliser",
      value: 7,
      change: "-3%",
      trend: "down",
      icon: Clock,
      color: "bg-amber-100 text-amber-600 border-amber-200",
    },
    {
      title: "Dossiers / semaine",
      value: 18,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "bg-green-100 text-green-600 border-green-200",
    },
    {
      title: "Patients à risque",
      value: 5,
      change: "0%",
      trend: "neutral",
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600 border-red-200",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-l-4 border-t-0 border-r-0 border-b-0 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
          style={{ borderLeftColor: stat.color.split(" ")[1].replace("text-", "border-") }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                <p
                  className={`text-xs mt-1 flex items-center ${
                    stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {stat.trend === "up" && <span className="mr-1">↑</span>}
                  {stat.trend === "down" && <span className="mr-1">↓</span>}
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
