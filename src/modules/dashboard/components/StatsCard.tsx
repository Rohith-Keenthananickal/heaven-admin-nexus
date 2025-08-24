import { Card, CardContent } from "@/modules/shared/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  color?: "blue" | "green" | "yellow" | "red"
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  color = "blue" 
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive": return "text-success"
      case "negative": return "text-destructive"
      default: return "text-muted-foreground"
    }
  }

  const getIconBg = () => {
    switch (color) {
      case "green": return "bg-success/10 text-success"
      case "yellow": return "bg-warning/10 text-warning"
      case "red": return "bg-destructive/10 text-destructive"
      default: return "bg-primary/10 text-primary"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-sm ${getChangeColor()}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${getIconBg()}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}