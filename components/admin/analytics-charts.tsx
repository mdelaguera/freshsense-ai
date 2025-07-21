"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts"

export function AnalyticsCharts() {
  // Mock data - in real app, this would come from your analytics API
  const analysisData = [
    { date: "Jan", analyses: 820, fresh: 692, spoiled: 128 },
    { date: "Feb", analyses: 932, fresh: 801, spoiled: 131 },
    { date: "Mar", analyses: 1045, fresh: 921, spoiled: 124 },
    { date: "Apr", analyses: 1124, fresh: 1002, spoiled: 122 },
    { date: "May", analyses: 1287, fresh: 1156, spoiled: 131 },
    { date: "Jun", analyses: 1398, fresh: 1265, spoiled: 133 },
    { date: "Jul", analyses: 1542, fresh: 1401, spoiled: 141 },
  ]

  const accuracyData = [
    { week: "Week 1", accuracy: 92.1 },
    { week: "Week 2", accuracy: 93.4 },
    { week: "Week 3", accuracy: 91.8 },
    { week: "Week 4", accuracy: 94.2 },
    { week: "Week 5", accuracy: 95.1 },
    { week: "Week 6", accuracy: 94.7 },
    { week: "Week 7", accuracy: 96.2 },
  ]

  const foodTypeData = [
    { name: "Fruits", value: 35, count: 4387 },
    { name: "Vegetables", value: 28, count: 3512 },
    { name: "Dairy", value: 18, count: 2256 },
    { name: "Meat", value: 12, count: 1504 },
    { name: "Bread", value: 7, count: 878 },
  ]

  const responseTimeData = [
    { hour: "00:00", time: 1.2 },
    { hour: "04:00", time: 1.1 },
    { hour: "08:00", time: 1.8 },
    { hour: "12:00", time: 2.1 },
    { hour: "16:00", time: 1.9 },
    { hour: "20:00", time: 1.6 },
  ]

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']

  return (
    <div className="space-y-6">
      {/* Analysis Trends */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Volume Trend</CardTitle>
            <CardDescription>Monthly analysis volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="fresh" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  name="Fresh"
                />
                <Area 
                  type="monotone" 
                  dataKey="spoiled" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                  name="Spoiled"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accuracy Trend</CardTitle>
            <CardDescription>Model accuracy over the past 7 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[90, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Food Types and Response Times */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analysis by Food Type</CardTitle>
            <CardDescription>Distribution of analyzed food categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={foodTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {foodTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {foodTypeData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time by Hour</CardTitle>
            <CardDescription>Average API response times throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              Peak response times occur during lunch hours (12:00-16:00)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Key performance indicators for the past month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">94.2%</div>
              <div className="text-sm text-muted-foreground">Average Accuracy</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">1.8s</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-purple-600">12,547</div>
              <div className="text-sm text-muted-foreground">Total Analyses</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-orange-600">99.7%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}