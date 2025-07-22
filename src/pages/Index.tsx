import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Palette, BarChart3, Ticket, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TicketForm } from "@/components/TicketForm";
import { TicketList } from "@/components/TicketList";
import { StatsCards } from "@/components/StatsCards";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";
import type { Ticket as TicketType } from "@/types/ticket";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "tickets">("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tickets from Supabase
  const { data: tickets = [], isLoading: ticketsLoading, error: ticketsError } = useQuery({
    queryKey: ['tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(ticket => ({
        ...ticket,
        createdAt: new Date(ticket.created_at),
        updatedAt: new Date(ticket.updated_at)
      })) as TicketType[];
    },
    enabled: !!user,
  });

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (newTicket: Omit<TicketType, "id" | "createdAt" | "updatedAt">) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          user_id: user.id,
          title: newTicket.title,
          description: newTicket.description,
          category: newTicket.category,
          priority: newTicket.priority,
          status: newTicket.status,
          assigned_to: newTicket.assignedTo
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setShowTicketForm(false);
      toast({
        title: "Success",
        description: "Ticket created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
      console.error('Error creating ticket:', error);
    },
  });

  // Authentication state management
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Redirect to auth if not authenticated
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Redirect if not authenticated
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  // Don't render if not authenticated (will be redirected)
  if (!user || !session) {
    return null;
  }

  // Handle tickets error
  if (ticketsError) {
    toast({
      title: "Error",
      description: "Failed to load tickets",
      variant: "destructive",
    });
  }

  const handleCreateTicket = (newTicket: Omit<TicketType, "id" | "createdAt" | "updatedAt">) => {
    createTicketMutation.mutate(newTicket);
  };

  // Show loading state while checking authentication or loading tickets
  if (loading || ticketsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center gap-2 mr-4">
                <span className="text-sm text-muted-foreground">Welcome,</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              
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
                onClick={() => navigate('/leads')}
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

              <Button
                variant="outline"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
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
          isLoading={createTicketMutation.isPending}
        />
      )}
    </div>
  );
};

export default Index;
