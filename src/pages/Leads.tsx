import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "Maria Rodriguez",
      email: "maria@artcollector.com",
      phone: "+1 (555) 123-4567",
      company: "Rodriguez Collection",
      status: "hot",
      source: "referral",
      artInterests: ["Contemporary", "Abstract"],
      budget: 50000,
      notes: "Interested in acquiring pieces for new gallery space",
      lastContact: new Date(2024, 0, 15),
      createdAt: new Date(2024, 0, 10),
      updatedAt: new Date(2024, 0, 15)
    },
    {
      id: "2",
      name: "David Chen",
      email: "d.chen@modernspaces.com",
      phone: "+1 (555) 987-6543", 
      company: "Modern Spaces Interior",
      status: "warm",
      source: "website",
      artInterests: ["Modern", "Sculptures"],
      budget: 25000,
      notes: "Looking for statement pieces for corporate offices",
      lastContact: new Date(2024, 0, 12),
      createdAt: new Date(2024, 0, 8),
      updatedAt: new Date(2024, 0, 12)
    }
  ]);

  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Eleanor Hartwell",
      email: "ehartwell@heritage.com",
      phone: "+1 (555) 246-8135",
      company: "Heritage Foundation",
      totalPurchases: 125000,
      artCollection: ["Renaissance", "Classical", "Baroque"],
      preferredArtist: "Various Old Masters",
      notes: "Long-time collector with focus on historical pieces",
      createdAt: new Date(2023, 5, 20),
      updatedAt: new Date(2024, 0, 8),
      lastPurchase: new Date(2023, 11, 15)
    }
  ]);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [activeTab, setActiveTab] = useState("leads");

  const handleCreateLead = (newLead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    const lead: Lead = {
      ...newLead,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setLeads(prev => [lead, ...prev]);
    setShowLeadForm(false);
  };

  const getStatsCards = () => [
    {
      title: "Total Leads",
      value: leads.length,
      icon: Users,
      color: "text-gallery-blue"
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
      color: "text-gallery-gold"
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
                variant="gold"
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
              <Building className="h-5 w-5 text-gallery-blue" />
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
                <LeadsList leads={leads} />
              </TabsContent>

              <TabsContent value="clients" className="mt-6">
                <ClientsList clients={clients} />
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