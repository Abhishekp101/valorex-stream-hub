 import { useEffect, useState } from 'react';
 import { Link } from 'react-router-dom';
 import { BookmarkPlus, Film } from 'lucide-react';
 import { motion } from 'framer-motion';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/context/AuthContext';
 import Header from '@/components/Header';
 import VerticalMovieCard from '@/components/VerticalMovieCard';
 import { Button } from '@/components/ui/button';
 import { Skeleton } from '@/components/ui/skeleton';
 import { Movie } from '@/types/movie';
 
 const Watchlist = () => {
   const { user, loading: authLoading } = useAuth();
   const [movies, setMovies] = useState<Movie[]>([]);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     if (user) {
       fetchWatchlist();
     } else if (!authLoading) {
       setLoading(false);
     }
   }, [user, authLoading]);
 
   const fetchWatchlist = async () => {
     if (!user) return;
     
     setLoading(true);
     const { data, error } = await supabase
       .from('watchlist')
       .select(`
         id,
         movie_id,
         movies (
           id,
           title,
           poster_url,
           release_date,
           category,
           language,
           quality,
           info,
           download_link,
           video_link
         )
       `)
       .eq('user_id', user.id)
       .order('added_at', { ascending: false });
 
     if (!error && data) {
       const mapped: Movie[] = data
         .filter((item: any) => item.movies)
         .map((item: any) => ({
           id: item.movies.id,
           title: item.movies.title,
           poster: item.movies.poster_url || '',
           date: item.movies.release_date || '',
           category: (item.movies.category as 'hollywood' | 'bollywood') || 'hollywood',
           language: (item.movies.language as 'english' | 'hindi' | 'dual') || 'english',
           quality: item.movies.quality || '1080p',
           info: item.movies.info || '',
           downloadLink: item.movies.download_link || '',
           videoLink: item.movies.video_link || '',
         }));
       setMovies(mapped);
     }
     setLoading(false);
   };
 
   if (!authLoading && !user) {
     return (
       <div className="min-h-screen bg-background">
         <Header />
         <main className="container py-20 text-center">
           <div className="max-w-md mx-auto">
             <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
               <BookmarkPlus className="w-10 h-10 text-muted-foreground" />
             </div>
             <h1 className="text-2xl font-bold mb-3">Sign in to view your Watchlist</h1>
             <p className="text-muted-foreground mb-8">Save movies you want to watch later by clicking the + button on any movie.</p>
             <Link to="/login">
               <Button size="lg" className="gap-2">
                 Sign In
               </Button>
             </Link>
           </div>
         </main>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-background">
       <Header />
       <main className="container py-8">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
         >
           <div className="flex items-center gap-3 mb-8">
             <BookmarkPlus className="w-8 h-8 text-primary" />
             <h1 className="text-3xl font-bold">My Watchlist</h1>
           </div>
 
           {loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
               {[...Array(8)].map((_, i) => (
                 <Skeleton key={i} className="aspect-video rounded-lg" />
               ))}
             </div>
           ) : movies.length === 0 ? (
             <div className="text-center py-20">
               <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                 <Film className="w-10 h-10 text-muted-foreground" />
               </div>
               <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
               <p className="text-muted-foreground mb-6">Start adding movies by clicking the + button on any movie.</p>
               <Link to="/">
                 <Button>Browse Movies</Button>
               </Link>
             </div>
           ) : (
             <>
               <p className="text-muted-foreground mb-6">{movies.length} movies in your watchlist</p>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                 {movies.map((movie, index) => (
                   <Link to={`/movie/${movie.id}`} key={movie.id}>
                     <VerticalMovieCard movie={movie} index={index} />
                   </Link>
                 ))}
               </div>
             </>
           )}
         </motion.div>
       </main>
     </div>
   );
 };
 
 export default Watchlist;