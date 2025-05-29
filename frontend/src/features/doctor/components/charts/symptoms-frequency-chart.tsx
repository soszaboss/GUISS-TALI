import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function SymptomsFrequencyChart() {
  // Ces données seraient normalement récupérées depuis une API
  const data = [
    { name: "Vision floue", count: 42 },
    { name: "Fatigue oculaire", count: 38 },
    { name: "Maux de tête", count: 31 },
    { name: "Vision double", count: 18 },
    { name: "Sensibilité lumière", count: 27 },
    { name: "Yeux secs", count: 24 },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Fréquence des symptômes signalés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value} patients`, "Nombre"]} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
