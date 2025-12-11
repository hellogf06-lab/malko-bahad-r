import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Renk Paletimiz (Profesyonel Tonlar)
const COLORS = ['#3b82f6', '#f97316', '#ef4444', '#10b981'];

export function Overview({ data, pieData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      
      {/* 1. NAKİT AKIŞI GRAFİĞİ (SOL - BÜYÜK) */}
      <Card className="col-span-4 border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Nakit Akışı Analizi</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₺${value}`}
                />
                <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="gelir" name="Gelir" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gider" name="Gider" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. GİDER DAĞILIMI (SAĞ - KÜÇÜK) */}
      <Card className="col-span-3 border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Gider Dağılımı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend (Açıklama) */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm text-slate-600">{entry.name}</span>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
