import { Phone, Mail, Calendar, DollarSign, Building, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Client } from "@/types/sales";

interface ClientsListProps {
  clients: Client[];
}

export function ClientsList({ clients }: ClientsListProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No clients found. Convert leads to build your client base.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <Card key={client.id} className="shadow-elegant border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">{client.name}</h3>
                  <Badge variant="default" className="bg-gallery-gold text-gallery-gold-foreground">
                    VIP Client
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>
                  
                  {client.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {client.phone}
                    </div>
                  )}
                  
                  {client.company && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {client.company}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gallery-gold font-semibold">
                    <DollarSign className="h-4 w-4" />
                    ${client.totalPurchases.toLocaleString()}
                  </div>
                </div>

                {client.artCollection && client.artCollection.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground mb-1">Art Collection:</p>
                    <div className="flex flex-wrap gap-1">
                      {client.artCollection.map((art, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {art}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {client.preferredArtist && (
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <Star className="h-4 w-4 text-gallery-gold" />
                    <span className="text-muted-foreground">Preferred Artist:</span>
                    <span className="font-medium text-foreground">{client.preferredArtist}</span>
                  </div>
                )}

                {client.notes && (
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">{client.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Client since: {client.createdAt.toLocaleDateString()}
                  </div>
                  {client.lastPurchase && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Last purchase: {client.lastPurchase.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button variant="gold" size="sm">
                  Contact
                </Button>
                <Button variant="outline" size="sm">
                  History
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