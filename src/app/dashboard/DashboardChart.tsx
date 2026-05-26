"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "LUN", value: 1200 },
  { name: "MAR", value: 3000 },
  { name: "MER", value: 2000 },
  { name: "JEU", value: 2780 },
  { name: "VEN", value: 1890 },
  { name: "SAM", value: 2390 },
  { name: "DIM", value: 3490 },
];

export default function DashboardChart() {
  return (
    <div className="h-64 w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 10 }} 
          />
          <Tooltip 
            cursor={{ fill: '#27272a', opacity: 0.4 }} 
            contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#60a5fa' }}
          />
          <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
