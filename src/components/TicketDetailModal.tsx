import { X, Clock, User, AlertCircle, CheckCircle, Palette, Truck, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Ticket } from "@/types/ticket";

interface TicketDetailModalProps {
  ticket: Ticket;
  onClose: () => void;
  onEdit: (ticket: Ticket) => void;
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    "Authentication": <Shield className="h-5 w-5" />,
    "Exhibition": <Palette className="h-5 w-5" />,
    "Sales": <CheckCircle className="h-5 w-5" />,
    "Shipping": <Truck className="h-5 w-5" />,
    "Conservation": <AlertCircle className="h-5 w-5" />,
    "Insurance": <Shield className="h-5 w-5" />,
    "Client Relations": <User className="h-5 w-5" />,
    "Technical": <AlertCircle className="h-5 w-5" />,
    "General": <Clock className="h-5 w-5" />
  };
  return iconMap[category] || <Clock className="h-5 w-5" />;
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

export const TicketDetailModal = ({ ticket, onClose, onEdit }: TicketDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-elegant border-border">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gallery-warm rounded-md">
                {getCategoryIcon(ticket.category)}
              </div>
              <div>
                <CardTitle className="text-xl">{ticket.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ticket ID: {ticket.id.slice(0, 8)}...
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Status and Priority */}
          <div className="flex flex-wrap gap-3">
            <Badge 
              variant="secondary" 
              className={`${getPriorityColor(ticket.priority)} border`}
            >
              Priority: {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </Badge>
            
            <Badge 
              variant="secondary"
              className={`${getStatusColor(ticket.status)} border`}
            >
              Status: {ticket.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            
            <Badge variant="outline" className="bg-gallery-warm">
              Category: {ticket.category}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Assignment and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Assignment</h4>
              {ticket.assignedTo ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  {ticket.assignedTo}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Unassigned</p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Timeline</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Created: {ticket.createdAt.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Updated: {ticket.updatedAt.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="gold"
              onClick={() => onEdit(ticket)}
              className="gap-2"
            >
              Edit Ticket
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};