 import { useState, useEffect } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import { Badge } from '@/components/ui/badge';
 import { Skeleton } from '@/components/ui/skeleton';
 import { User, Clock, Film, BookmarkPlus } from 'lucide-react';
 import { formatDistanceToNow } from 'date-fns';
 
 interface UserProfile {
   user_id: string;
   display_name: string | null;
   created_at: string;
   email?: string;
   watch_count?: number;
   watchlist_count?: number;
 }
 
 const UsersAdmin = () => {
   const [users, setUsers] = useState<UserProfile[]>([]);
   const [loading, setLoading] = useState(true);
 
   const fetchUsers = async () => {
     setLoading(true);
     
     // Fetch user profiles
     const { data: profiles, error } = await supabase
       .from('user_profiles')
       .select('*')
       .order('created_at', { ascending: false });
 
     if (!error && profiles) {
       // Fetch watch history counts for each user
       const usersWithStats = await Promise.all(
         profiles.map(async (profile) => {
           const [watchRes, watchlistRes] = await Promise.all([
             supabase
               .from('watch_history')
               .select('id', { count: 'exact', head: true })
               .eq('user_id', profile.user_id),
             supabase
               .from('watchlist')
               .select('id', { count: 'exact', head: true })
               .eq('user_id', profile.user_id),
           ]);
 
           return {
             ...profile,
             watch_count: watchRes.count || 0,
             watchlist_count: watchlistRes.count || 0,
           };
         })
       );
       
       setUsers(usersWithStats);
     }
     
     setLoading(false);
   };
 
   useEffect(() => {
     fetchUsers();
   }, []);
 
   if (loading) {
     return (
       <div className="space-y-4">
         {[...Array(5)].map((_, i) => (
           <Skeleton key={i} className="h-16 w-full" />
         ))}
       </div>
     );
   }
 
   if (users.length === 0) {
     return (
       <div className="text-center py-12">
         <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
         <p className="text-muted-foreground">No registered users yet</p>
         <p className="text-sm text-muted-foreground mt-1">
           Users will appear here after they create an account
         </p>
       </div>
     );
   }
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h3 className="text-lg font-semibold">Registered Users ({users.length})</h3>
       </div>
 
       <div className="rounded-lg border">
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>User</TableHead>
               <TableHead>Joined</TableHead>
               <TableHead className="text-center">Watched</TableHead>
               <TableHead className="text-center">Watchlist</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {users.map((user) => (
               <TableRow key={user.user_id}>
                 <TableCell>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                       <User className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                       <p className="font-medium">
                         {user.display_name || 'Anonymous User'}
                       </p>
                       <p className="text-xs text-muted-foreground">
                         {user.user_id.substring(0, 8)}...
                       </p>
                     </div>
                   </div>
                 </TableCell>
                 <TableCell>
                   <div className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Clock className="w-3 h-3" />
                     {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                   </div>
                 </TableCell>
                 <TableCell className="text-center">
                   <Badge variant="secondary" className="gap-1">
                     <Film className="w-3 h-3" />
                     {user.watch_count}
                   </Badge>
                 </TableCell>
                 <TableCell className="text-center">
                   <Badge variant="outline" className="gap-1">
                     <BookmarkPlus className="w-3 h-3" />
                     {user.watchlist_count}
                   </Badge>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </div>
     </div>
   );
 };
 
 export default UsersAdmin;