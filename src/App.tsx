import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { MovieProvider } from "@/context/MovieContext";
import { BlogProvider } from "@/context/BlogContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import MovieDetails from "./pages/MovieDetails";
import Software from "./pages/Software";
import SoftwareDetails from "./pages/SoftwareDetails";
import Watch from "./pages/Watch";
import Watchlist from "./pages/Watchlist";
import WatchHistory from "./pages/WatchHistory";
import SeriesDetails from "./pages/SeriesDetails";
import WatchEpisode from "./pages/WatchEpisode";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <MovieProvider>
          <BlogProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/watch/:id" element={<Watch />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/history" element={<WatchHistory />} />
                  <Route path="/series/:id" element={<SeriesDetails />} />
                  <Route path="/watch-episode/:id" element={<WatchEpisode />} />
                  <Route path="/software" element={<Software />} />
                  <Route path="/software/:id" element={<SoftwareDetails />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </BlogProvider>
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
