import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users, Building, Phone, Mail, Calendar, DollarSign, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadForm } from "@/components/LeadForm";
import { LeadsList } from "@/components/LeadsList";
import { ClientsList } from "@/components/ClientsList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";
import type { Lead, Client } from "@/types/sales";

const Leads = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will be redirected)
  if (!user || !session) {
    return null;
  }

  // Fetch leads
  const { data: leads = [], isLoading: leadsLoading, error: leadsError } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match the Lead type
      return data.map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        status: lead.status as Lead["status"],
        source: lead.source as Lead["source"],
        artInterests: lead.art_interests || [],
        budget: lead.budget,
        notes: lead.notes,
        lastContact: new Date(lead.last_contact),
        createdAt: new Date(lead.created_at),
        updatedAt: new Date(lead.updated_at)
      })) as Lead[];
    },
    enabled: !!user,
  });

  // Fetch clients
  const { data: clients = [], isLoading: clientsLoading, error: clientsError } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match the Client type
      return data.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        totalPurchases: Number(client.total_purchases) || 0,
        artCollection: client.art_collection || [],
        preferredArtist: client.preferred_artist,
        notes: client.notes,
        createdAt: new Date(client.created_at),
        updatedAt: new Date(client.updated_at),
        lastPurchase: client.last_purchase ? new Date(client.last_purchase) : undefined
      })) as Client[];
    },
    enabled: !!user,
  });

  // Create lead mutation
  const createLeadMutation = useMutation({
    mutationFn: async (newLead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          user_id: user!.id,
          name: newLead.name,
          email: newLead.email,
          phone: newLead.phone,
          company: newLead.company,
          status: newLead.status,
          source: newLead.source,
          art_interests: newLead.artInterests,
          budget: newLead.budget,
          notes: newLead.notes,
          last_contact: newLead.lastContact.toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
      setShowLeadForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
      console.error("Error creating lead:", error);
    },
  });

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [activeTab, setActiveTab] = useState("leads");

  const handleCreateLead = (newLead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    createLeadMutation.mutate(newLead);
  };

  const getStatsCards = () => [
    {
      title: "Total Leads",
      value: leads.length,
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Hot Leads",
      value: leads.filter(l => l.status === "hot").length,
      icon: Calendar,
      color: "text-red-600"
    },
    {
      title: "Total Clients",
      value: clients.length,
      icon: Building,
      color: "text-secondary"
    },
    {
      title: "Revenue Pipeline",
      value: `$${leads.reduce((sum, lead) => sum + (lead.budget || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card shadow-elegant">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-gallery rounded-lg">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Sales & Clients</h1>
                <p className="text-sm text-muted-foreground">Manage leads and client relationships</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              
              <div className="flex items-center gap-2 mr-4">
                <span className="text-sm text-muted-foreground">Welcome,</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              
              <Button
                variant="default"
                onClick={() => setShowLeadForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Lead
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStatsCards().map((stat, index) => (
            <Card key={index} className="shadow-elegant border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for Leads and Clients */}
        <Card className="shadow-elegant border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Sales Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="leads" className="gap-2">
                  <Users className="h-4 w-4" />
                  Leads ({leads.length})
                </TabsTrigger>
                <TabsTrigger value="clients" className="gap-2">
                  <Building className="h-4 w-4" />
                  Clients ({clients.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leads" className="mt-6">
                {leadsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : leadsError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">Failed to load leads</p>
                  </div>
                ) : (
                  <LeadsList leads={leads} />
                )}
              </TabsContent>

              <TabsContent value="clients" className="mt-6">
                {clientsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : clientsError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">Failed to load clients</p>
                  </div>
                ) : (
                  <ClientsList clients={clients} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Lead Form Modal */}
      {showLeadForm && (
        <LeadForm
          onSubmit={handleCreateLead}
          onCancel={() => setShowLeadForm(false)}
        />
      )}
    </div>
  );
};

export default Leads;