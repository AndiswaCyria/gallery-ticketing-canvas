import { useState } from "react";
import { Plus, Palette, BarChart3, Ticket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TicketForm } from "@/components/TicketForm";
import { TicketList } from "@/components/TicketList";
import { StatsCards } from "@/components/StatsCards";
import type { Ticket as TicketType } from "@/types/ticket";

const Index = () => {
  const [tickets, setTickets] = useState<TicketType[]>([
    {
      id: "1",
      title: "Painting Authentication Required",
      description: "Need certificate of authenticity for 1960s abstract piece",
      category: "Authentication",
      priority: "high",
      status: "open",
      createdAt: new Date(2024, 0, 15),
      updatedAt: new Date(2024, 0, 15),
      assignedTo: "Sarah Chen"
    },
    {
      id: "2", 
      title: "Gallery Exhibition Setup",
      description: "Coordinate lighting and positioning for upcoming contemporary art show",
      category: "Exhibition",
      priority: "medium",
      status: "in-progress",
      createdAt: new Date(2024, 0, 14),
      updatedAt: new Date(2024, 0, 16),
      assignedTo: "Marcus Rivera"
    },
    {
      id: "3",
      title: "Client Commission Inquiry",
      description: "High-value client requesting custom portrait commission timeline",
      category: "Sales",
      priority: "urgent",
      status: "open",
      createdAt: new Date(2024, 0, 16),
      updatedAt: new Date(2024, 0, 16)
    }
  ]);

  const [showTicketForm, setShowTicketForm] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "tickets">("dashboard");

  const handleCreateTicket = (newTicket: Omit<TicketType, "id" | "createdAt" | "updatedAt">) => {
    const ticket: TicketType = {
      ...newTicket,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTickets(prev => [ticket, ...prev]);
    setShowTicketForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card shadow-elegant">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-gallery rounded-lg">
                <Palette className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">ArtDesk</h1>
                <p className="text-sm text-muted-foreground">Internal Support Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant={currentView === "dashboard" ? "gallery" : "ghost"}
                onClick={() => setCurrentView("dashboard")}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
              
              <Button
                variant={currentView === "tickets" ? "gallery" : "ghost"}
                onClick={() => setCurrentView("tickets")}
                className="gap-2"
              >
                <Ticket className="h-4 w-4" />
                Tickets
              </Button>

              <Button
                variant="ghost"
                onClick={() => window.location.href = '/leads'}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Leads
              </Button>
              
              <Button
                variant="gold"
                onClick={() => setShowTicketForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Ticket
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {currentView === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Support Dashboard
              </h2>
              <p className="text-muted-foreground">
                Manage gallery operations and client support efficiently
              </p>
            </div>

            <StatsCards tickets={tickets} />

            {/* Recent Tickets */}
            <Card className="shadow-elegant border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-gallery-blue" />
                  Recent Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TicketList 
                  tickets={tickets.slice(0, 3)} 
                  showActions={false}
                />
                <div className="mt-4 text-center">
                  <Button 
                    variant="elegant"
                    onClick={() => setCurrentView("tickets")}
                  >
                    View All Tickets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === "tickets" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  All Tickets
                </h2>
                <p className="text-muted-foreground">
                  Manage and track all support requests
                </p>
              </div>
              <Button
                variant="gold"
                onClick={() => setShowTicketForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Ticket
              </Button>
            </div>

            <Card className="shadow-elegant border-border">
              <CardContent className="p-6">
                <TicketList tickets={tickets} showActions={true} />
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Ticket Form Modal */}
      {showTicketForm && (
        <TicketForm
          onSubmit={handleCreateTicket}
          onCancel={() => setShowTicketForm(false)}
        />
      )}
    </div>
  );
};

export default Index;
