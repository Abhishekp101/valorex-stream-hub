 import { useState, useEffect } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/context/AuthContext';
 
 interface WatchHistoryItem {
   id: string;
   movie_id: string;
   progress_seconds: number;
   duration_seconds: number | null;
   last_watched_at: string;
   movie: {
     id: string;
     title: string;
     poster_url: string | null;
     video_link: string | null;
   };
 }
 
 export const useWatchHistory = () => {
   const { user } = useAuth();
   const [history, setHistory] = useState<WatchHistoryItem[]>([]);
   const [loading, setLoading] = useState(true);
 
   const fetchHistory = async () => {
     if (!user) {
       setHistory([]);
       setLoading(false);
       return;
     }
 
     setLoading(true);
     const { data, error } = await supabase
       .from('watch_history')
       .select(`
         id,
         movie_id,
         progress_seconds,
         duration_seconds,
         last_watched_at,
         movie:movies(id, title, poster_url, video_link)
       `)
       .eq('user_id', user.id)
       .order('last_watched_at', { ascending: false })
       .limit(10);
 
     if (!error && data) {
       // Filter out entries where movie is null and ensure proper typing
       const validData = data.filter(item => item.movie !== null) as WatchHistoryItem[];
       setHistory(validData);
     }
     setLoading(false);
   };
 
   const updateProgress = async (movieId: string, progressSeconds: number, durationSeconds?: number) => {
     if (!user) return;
 
     const { error } = await supabase
       .from('watch_history')
       .upsert({
         user_id: user.id,
         movie_id: movieId,
         progress_seconds: progressSeconds,
         duration_seconds: durationSeconds || null,
         last_watched_at: new Date().toISOString(),
       }, {
         onConflict: 'user_id,movie_id'
       });
 
     if (!error) {
       fetchHistory();
     }
   };
 
   const clearHistory = async (movieId: string) => {
     if (!user) return;
 
     await supabase
       .from('watch_history')
       .delete()
       .eq('user_id', user.id)
       .eq('movie_id', movieId);
     
     fetchHistory();
   };
 
   useEffect(() => {
     fetchHistory();
   }, [user]);
 
   return { history, loading, updateProgress, clearHistory, refetch: fetchHistory };
 };