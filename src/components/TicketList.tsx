import { Clock, User, AlertCircle, CheckCircle, Palette, Truck, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Ticket } from "@/types/ticket";

interface TicketListProps {
  tickets: Ticket[];
  showActions?: boolean;
  onViewTicket?: (ticket: Ticket) => void;
  onEditTicket?: (ticket: Ticket) => void;
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    "Authentication": <Shield className="h-4 w-4" />,
    "Exhibition": <Palette className="h-4 w-4" />,
    "Sales": <CheckCircle className="h-4 w-4" />,
    "Shipping": <Truck className="h-4 w-4" />,
    "Conservation": <AlertCircle className="h-4 w-4" />,
    "Insurance": <Shield className="h-4 w-4" />,
    "Client Relations": <User className="h-4 w-4" />,
    "Technical": <AlertCircle className="h-4 w-4" />,
    "General": <Clock className="h-4 w-4" />
  };
  return iconMap[category] || <Clock className="h-4 w-4" />;
};

const getPriorityColor = (priority: string) => {
  const colorMap: Record<string, string> = {
    "low": "bg-green-100 text-green-800 border-green-200",
    "medium": "bg-yellow-100 text-yellow-800 border-yellow-200", 
    "high": "bg-orange-100 text-orange-800 border-orange-200",
    "urgent": "bg-red-100 text-red-800 border-red-200"
  };
  return colorMap[priority] || colorMap.medium;
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    "open": "bg-blue-100 text-blue-800 border-blue-200",
    "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "resolved": "bg-green-100 text-green-800 border-green-200",
    "closed": "bg-gray-100 text-gray-800 border-gray-200"
  };
  return colorMap[status] || colorMap.open;
};

export const TicketList = ({ tickets, showActions = true, onViewTicket, onEditTicket }: TicketListProps) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No tickets found</h3>
        <p className="text-muted-foreground">Create your first support ticket to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="border-border hover:shadow-elegant transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 bg-gallery-warm rounded-md">
                    {getCategoryIcon(ticket.category)}
                  </div>
                  <h3 className="font-semibold text-foreground text-lg leading-tight">
                    {ticket.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {ticket.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Badge 
                    variant="secondary" 
                    className={`${getPriorityColor(ticket.priority)} border`}
                  >
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </Badge>
                  
                  <Badge 
                    variant="secondary"
                    className={`${getStatusColor(ticket.status)} border`}
                  >
                    {ticket.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  
                  <Badge variant="outline" className="bg-gallery-warm">
                    {ticket.category}
                  </Badge>
                  
                  {ticket.assignedTo && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      {ticket.assignedTo}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {ticket.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {showActions && (
                <div className="flex gap-2">
                  <Button 
                    variant="elegant" 
                    size="sm"
                    onClick={() => onViewTicket?.(ticket)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditTicket?.(ticket)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};