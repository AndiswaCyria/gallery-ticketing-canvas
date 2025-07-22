-- Create tickets table for support ticket management
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for ticket access
CREATE POLICY "Users can view their own tickets" 
ON public.tickets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets" 
ON public.tickets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" 
ON public.tickets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tickets" 
ON public.tickets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample tickets for the current authenticated user
-- Note: This will only work when a user is authenticated
INSERT INTO public.tickets (user_id, title, description, category, priority, status, assigned_to) VALUES 
(auth.uid(), 'Painting Authentication Required', 'Need certificate of authenticity for 1960s abstract piece', 'Authentication', 'high', 'open', 'Sarah Chen'),
(auth.uid(), 'Gallery Exhibition Setup', 'Coordinate lighting and positioning for upcoming contemporary art show', 'Exhibition', 'medium', 'in-progress', 'Marcus Rivera'),
(auth.uid(), 'Client Commission Inquiry', 'High-value client requesting custom portrait commission timeline', 'Sales', 'urgent', 'open', NULL);