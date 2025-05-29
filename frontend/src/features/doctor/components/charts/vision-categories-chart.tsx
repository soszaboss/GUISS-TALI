import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function VisionCategoriesChart() {
  // Ces données seraient normalement récupérées depuis une API
  const data = [
    { name: "Vision normale", value: 65, color: "#4ade80" },
    { name: "Vision corrigée", value: 25, color: "#facc15" },
    { name: "Vision limitée", value: 8, color: "#fb923c" },
    { name: "Vision incompatible", value: 2, color: "#f87171" },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Répartition par catégorie de vision</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} patients`, "Nombre"]} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
