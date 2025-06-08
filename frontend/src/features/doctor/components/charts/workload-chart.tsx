import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function WorkloadChart() {
  // Ces données seraient normalement récupérées depuis une API
  const data = [
    { name: "Sem 1", consultations: 12, moyenne: 15 },
    { name: "Sem 2", consultations: 19, moyenne: 15 },
    { name: "Sem 3", consultations: 15, moyenne: 15 },
    { name: "Sem 4", consultations: 22, moyenne: 15 },
    { name: "Sem 5", consultations: 18, moyenne: 15 },
    { name: "Sem 6", consultations: 24, moyenne: 15 },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Évolution de la charge de travail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `${value} ${name === "consultations" ? "consultations" : ""}`,
                  name === "consultations" ? "Consultations" : "Moyenne",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="consultations"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Consultations"
              />
              <Line
                type="monotone"
                dataKey="moyenne"
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Moyenne"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
