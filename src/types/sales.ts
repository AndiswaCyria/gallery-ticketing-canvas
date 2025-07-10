export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: "cold" | "warm" | "hot" | "converted" | "lost";
  source: "website" | "referral" | "exhibition" | "social_media" | "cold_call" | "other";
  artInterests?: string[];
  budget?: number;
  notes?: string;
  lastContact: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  totalPurchases: number;
  artCollection?: string[];
  preferredArtist?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lastPurchase?: Date;
}