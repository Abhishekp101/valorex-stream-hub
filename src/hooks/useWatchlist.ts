 import { useState, useEffect } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/context/AuthContext';
 import { toast } from 'sonner';
 
 export const useWatchlist = (movieId?: string) => {
   const { user } = useAuth();
   const [isInWatchlist, setIsInWatchlist] = useState(false);
   const [loading, setLoading] = useState(false);
 
   useEffect(() => {
     if (user && movieId) {
       checkWatchlist();
     } else {
       setIsInWatchlist(false);
     }
   }, [user, movieId]);
 
   const checkWatchlist = async () => {
     if (!user || !movieId) return;
     
     const { data } = await supabase
       .from('watchlist')
       .select('id')
       .eq('user_id', user.id)
       .eq('movie_id', movieId)
       .maybeSingle();
     
     setIsInWatchlist(!!data);
   };
 
   const toggleWatchlist = async () => {
     if (!user) {
       toast.error('Please login to add to watchlist');
       return;
     }
     if (!movieId) return;
 
     setLoading(true);
     
     if (isInWatchlist) {
       const { error } = await supabase
         .from('watchlist')
         .delete()
         .eq('user_id', user.id)
         .eq('movie_id', movieId);
       
       if (!error) {
         setIsInWatchlist(false);
         toast.success('Removed from watchlist');
       }
     } else {
       const { error } = await supabase
         .from('watchlist')
         .insert({ user_id: user.id, movie_id: movieId });
       
       if (!error) {
         setIsInWatchlist(true);
         toast.success('Added to watchlist');
       }
     }
     
     setLoading(false);
   };
 
   return { isInWatchlist, toggleWatchlist, loading };
 };