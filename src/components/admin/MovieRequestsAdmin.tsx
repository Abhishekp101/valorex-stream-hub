import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2, MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MovieRequest {
  id: string;
  movie_name: string;
  language: string;
  whatsapp_number: string | null;
  status: string;
  created_at: string;
}

const MovieRequestsAdmin = () => {
  const [requests, setRequests] = useState<MovieRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('movie_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleMarkDone = async (request: MovieRequest) => {
    const { error } = await supabase
      .from('movie_requests')
      .update({ status: 'done' })
      .eq('id', request.id);

    if (!error) {
      // Open WhatsApp if number is available
      if (request.whatsapp_number) {
        const message = encodeURIComponent(
          `Hi! Your requested movie "${request.movie_name}" is now available on Valorex. Visit our website to watch/download it now!`
        );
        const cleanNumber = request.whatsapp_number.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
      }
      toast.success('Request marked as done');
      fetchRequests();
    } else {
      toast.error('Failed to update request');
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('movie_requests')
      .delete()
      .eq('id', id);

    if (!error) {
      toast.success('Request deleted');
      fetchRequests();
    } else {
      toast.error('Failed to delete request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Movie Requests ({requests.length})</h3>
      
      {requests.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No movie requests yet</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id} className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium">{request.movie_name}</h4>
                      <Badge variant="secondary" className="capitalize">
                        {request.language}
                      </Badge>
                      <Badge variant={request.status === 'done' ? 'default' : 'outline'}>
                        {request.status}
                      </Badge>
                    </div>
                    {request.whatsapp_number && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {request.whatsapp_number}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {request.status !== 'done' && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleMarkDone(request)}
                        className="gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Done
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(request.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieRequestsAdmin;
