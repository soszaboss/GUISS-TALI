import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

// Données fictives pour le graphique de complétion
const data = [
  { name: "Complétés", value: 85 },
  { name: "En attente", value: 10 },
  { name: "Annulés", value: 5 },
]

const COLORS = ["#10b981", "#f59e0b", "#ef4444"]

export function TechnicianCompletionChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} examens`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
