import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { Ticket } from "@/types/ticket";

interface TicketStatusSelectorProps {
  ticket: Ticket;
  onStatusChange: (ticketId: string, newStatus: Ticket['status']) => void;
  isLoading?: boolean;
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    "open": "bg-blue-100 text-blue-800 border-blue-200",
    "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "resolved": "bg-green-100 text-green-800 border-green-200",
    "closed": "bg-gray-100 text-gray-800 border-gray-200"
  };
  return colorMap[status] || colorMap.open;
};

const statusOptions: { value: Ticket['status']; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" }
];

export const TicketStatusSelector = ({ ticket, onStatusChange, isLoading }: TicketStatusSelectorProps) => {
  const currentStatus = ticket.status;
  const currentLabel = statusOptions.find(option => option.value === currentStatus)?.label || currentStatus;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent"
          disabled={isLoading}
        >
          <Badge 
            variant="secondary"
            className={`${getStatusColor(currentStatus)} border cursor-pointer hover:opacity-80 transition-opacity`}
          >
            {currentLabel}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onStatusChange(ticket.id, option.value)}
            className={currentStatus === option.value ? "bg-accent" : ""}
          >
            <Badge 
              variant="secondary"
              className={`${getStatusColor(option.value)} border mr-2`}
            >
              {option.label}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};