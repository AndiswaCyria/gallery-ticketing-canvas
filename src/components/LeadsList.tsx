import { Phone, Mail, Calendar, DollarSign, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Lead } from "@/types/sales";

interface LeadsListProps {
  leads: Lead[];
}

export function LeadsList({ leads }: LeadsListProps) {
  const getStatusBadgeVariant = (status: Lead["status"]) => {
    switch (status) {
      case "hot": return "destructive";
      case "warm": return "secondary";
      case "cold": return "outline";
      case "converted": return "default";
      case "lost": return "secondary";
      default: return "outline";
    }
  };

  const getSourceBadge = (source: Lead["source"]) => {
    const sourceLabels = {
      website: "Website",
      referral: "Referral", 
      exhibition: "Exhibition",
      social_media: "Social Media",
      cold_call: "Cold Call",
      other: "Other"
    };
    return sourceLabels[source] || source;
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No leads found. Create your first lead to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Card key={lead.id} className="shadow-elegant border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">{lead.name}</h3>
                  <Badge variant={getStatusBadgeVariant(lead.status)}>
                    {lead.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {getSourceBadge(lead.source)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {lead.email}
                  </div>
                  
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {lead.phone}
                    </div>
                  )}
                  
                  {lead.company && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {lead.company}
                    </div>
                  )}
                  
                  {lead.budget && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      ${lead.budget.toLocaleString()}
                    </div>
                  )}
                </div>

                {lead.artInterests && lead.artInterests.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-1">Art Interests:</p>
                    <div className="flex flex-wrap gap-1">
                      {lead.artInterests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {lead.notes && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">{lead.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Last contact: {lead.lastContact.toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button variant="elegant" size="sm">
                  Contact
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}