 import { Link } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { Play, X } from 'lucide-react';
 import { useWatchHistory } from '@/hooks/useWatchHistory';
 import { useAuth } from '@/context/AuthContext';
 import { Progress } from '@/components/ui/progress';
 import { Button } from '@/components/ui/button';
 
 const ContinueWatching = () => {
   const { user } = useAuth();
   const { history, loading, clearHistory } = useWatchHistory();
 
   // Don't render if not logged in or no history
   if (!user || loading || history.length === 0) {
     return null;
   }
 
   return (
     <motion.section
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="px-4 sm:px-6 md:px-8 lg:px-12 pb-8"
     >
       <h2 className="font-display text-xl md:text-2xl font-bold mb-4">Continue Watching</h2>
       
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
         {history.slice(0, 6).map((item) => {
           const progressPercent = item.duration_seconds 
             ? Math.min((item.progress_seconds / item.duration_seconds) * 100, 100)
             : 0;
           
           return (
             <motion.div
               key={item.id}
               className="relative group"
               whileHover={{ scale: 1.02 }}
             >
               <Link to={`/watch/${item.movie.id}`}>
                 <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                   <img
                     src={item.movie.poster_url || '/placeholder.svg'}
                     alt={item.movie.title}
                     className="w-full h-full object-cover"
                   />
                   
                   {/* Play overlay */}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                       <Play className="w-5 h-5 text-primary-foreground" fill="currentColor" />
                     </div>
                   </div>
                   
                   {/* Progress bar at bottom */}
                   <div className="absolute bottom-0 left-0 right-0">
                     <Progress value={progressPercent} className="h-1 rounded-none" />
                   </div>
                 </div>
               </Link>
               
               {/* Remove button */}
               <Button
                 variant="ghost"
                 size="icon"
                 className="absolute top-1 right-1 h-6 w-6 bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                 onClick={(e) => {
                   e.preventDefault();
                   clearHistory(item.movie.id);
                 }}
               >
                 <X className="w-3 h-3 text-white" />
               </Button>
               
               <p className="mt-2 text-sm font-medium truncate">{item.movie.title}</p>
             </motion.div>
           );
         })}
       </div>
     </motion.section>
   );
 };
 
 export default ContinueWatching;