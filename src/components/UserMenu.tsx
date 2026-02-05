 import { useState } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { User, LogOut, History, BookmarkPlus, Settings } from 'lucide-react';
 import { motion } from 'framer-motion';
 import { useAuth } from '@/context/AuthContext';
 import { Button } from '@/components/ui/button';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
 
 const UserMenu = () => {
   const { user, isAdmin, signOut } = useAuth();
   const navigate = useNavigate();
 
   const handleSignOut = async () => {
     await signOut();
     navigate('/');
   };
 
   if (!user) {
     return (
       <Link to="/login">
         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
           <Button variant="ghost" size="icon" className="rounded-full">
             <User className="w-5 h-5" />
           </Button>
         </motion.div>
       </Link>
     );
   }
 
   const initials = user.email?.substring(0, 2).toUpperCase() || 'U';
 
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <motion.button
           className="flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
         >
           <Avatar className="h-9 w-9 cursor-pointer">
             <AvatarImage src={undefined} />
             <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
               {initials}
             </AvatarFallback>
           </Avatar>
         </motion.button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end" className="w-56">
         <DropdownMenuLabel className="font-normal">
           <div className="flex flex-col space-y-1">
             <p className="text-sm font-medium leading-none">Account</p>
             <p className="text-xs leading-none text-muted-foreground truncate">
               {user.email}
             </p>
           </div>
         </DropdownMenuLabel>
         <DropdownMenuSeparator />
         <DropdownMenuItem asChild className="cursor-pointer">
           <Link to="/?tab=history" className="flex items-center gap-2">
             <History className="w-4 h-4" />
             Watch History
           </Link>
         </DropdownMenuItem>
         <DropdownMenuItem asChild className="cursor-pointer">
             <Link to="/watchlist" className="flex items-center gap-2">
             <BookmarkPlus className="w-4 h-4" />
             My Watchlist
           </Link>
         </DropdownMenuItem>
         {isAdmin && (
           <>
             <DropdownMenuSeparator />
             <DropdownMenuItem asChild className="cursor-pointer">
               <Link to="/admin" className="flex items-center gap-2">
                 <Settings className="w-4 h-4" />
                 Admin Panel
               </Link>
             </DropdownMenuItem>
           </>
         )}
         <DropdownMenuSeparator />
         <DropdownMenuItem 
           className="cursor-pointer text-destructive focus:text-destructive"
           onClick={handleSignOut}
         >
           <LogOut className="w-4 h-4 mr-2" />
           Sign Out
         </DropdownMenuItem>
       </DropdownMenuContent>
     </DropdownMenu>
   );
 };
 
 export default UserMenu;