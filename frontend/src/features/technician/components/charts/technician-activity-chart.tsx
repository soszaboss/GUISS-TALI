import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Données fictives pour le graphique d'activité
const data = [
  {
    name: "Lun",
    "Examens réalisés": 12,
    "Temps moyen (min)": 25,
  },
  {
    name: "Mar",
    "Examens réalisés": 15,
    "Temps moyen (min)": 22,
  },
  {
    name: "Mer",
    "Examens réalisés": 10,
    "Temps moyen (min)": 28,
  },
  {
    name: "Jeu",
    "Examens réalisés": 14,
    "Temps moyen (min)": 24,
  },
  {
    name: "Ven",
    "Examens réalisés": 18,
    "Temps moyen (min)": 21,
  },
  {
    name: "Sam",
    "Examens réalisés": 8,
    "Temps moyen (min)": 26,
  },
  {
    name: "Dim",
    "Examens réalisés": 0,
    "Temps moyen (min)": 0,
  },
]

export function TechnicianActivityChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="Examens réalisés" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="Temps moyen (min)" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
