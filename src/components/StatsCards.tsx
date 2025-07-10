import { TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Ticket } from "@/types/ticket";

interface StatsCardsProps {
  tickets: Ticket[];
}

export const StatsCards = ({ tickets }: StatsCardsProps) => {
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in-progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    urgent: tickets.filter(t => t.priority === "urgent").length
  };

  const statsData = [
    {
      title: "Total Tickets",
      value: stats.total,
      icon: TrendingUp,
      color: "text-gallery-blue",
      bgColor: "bg-gradient-gallery"
    },
    {
      title: "Open Tickets", 
      value: stats.open,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: AlertTriangle,
      color: "text-yellow-600", 
      bgColor: "bg-yellow-100"
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={stat.title} className="shadow-elegant border-border hover:shadow-gallery transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color === "text-gallery-blue" ? "text-primary-foreground" : stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            {index === 0 && stats.urgent > 0 && (
              <p className="text-xs text-red-600 mt-1">
                {stats.urgent} urgent ticket{stats.urgent > 1 ? 's' : ''}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};