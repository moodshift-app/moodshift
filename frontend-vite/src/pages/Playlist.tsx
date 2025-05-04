import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { api, isApiError, Playlist } from "@/lib/api";
import {
  Calendar,
  Clock,
  ExternalLink,
  Music,
  CalendarDays,
  Loader2,
  Plus,
} from "lucide-react";

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to journal if not authenticated
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "Please connect your Spotify account first",
      });
      navigate("/journal");
      return;
    }

    const fetchPlaylists = async () => {
      setLoading(true);

      try {
        const response = await api.playlists.getUserPlaylists();

        if (!isApiError(response)) {
          setPlaylists(response.data);

          // If there are playlists, select the first one by default
          if (response.data.length > 0) {
            setSelectedPlaylist(response.data[0]);
          }
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error || "Failed to load playlists",
          });
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [isAuthenticated, navigate, toast]);

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleViewAnalysisDetails = (playlist: Playlist) => {
    // Store the playlist ID in session storage and navigate to the analyze page
    sessionStorage.setItem("currentPlaylistId", playlist.id);
    navigate("/analyze");
  };

  const handleOpenInSpotify = (url: string) => {
    window.open(url, "_blank");
  };

  const handleCreateNewPlaylist = () => {
    navigate("/journal");
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get mood color based on primary mood
  const getMoodColor = (mood: string): string => {
    const moodMap: Record<string, string> = {
      Happy: "bg-mood-happy",
      Sad: "bg-mood-sad",
      Angry: "bg-mood-angry",
      Calm: "bg-mood-calm",
      Energetic: "bg-mood-energetic",
      Anxious: "bg-mood-anxious",
      Nostalgic: "bg-mood-nostalgic",
      Romantic: "bg-mood-romantic",
      Focused: "bg-primary",
    };

    return moodMap[mood] || "bg-primary";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-center">
              My Playlists
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              View all of your mood-based playlists
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Loading your playlists...
              </h3>
            </div>
          ) : playlists.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Playlist List Column */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Playlist History</h2>
                <div className="space-y-3 mb-4">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className={`border p-3 rounded-lg cursor-pointer transition-colors hover:bg-secondary/50 ${
                        selectedPlaylist?.id === playlist.id
                          ? "border-primary bg-secondary/30"
                          : ""
                      }`}
                      onClick={() => handleSelectPlaylist(playlist)}
                    >
                      <div className="flex items-center gap-3">
                        {playlist.image_url ? (
                          <img
                            src={playlist.image_url}
                            alt={playlist.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center">
                            <Music className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">
                            {playlist.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(playlist.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${getMoodColor(
                                playlist.emotional_analysis.primary_mood
                              )}/20`}
                            >
                              {playlist.emotional_analysis.primary_mood}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleCreateNewPlaylist}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Playlist
                </Button>
              </div>

              {/* Playlist Details Column */}
              <div className="lg:col-span-2">
                {selectedPlaylist ? (
                  <motion.div
                    key={selectedPlaylist.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                          {selectedPlaylist.image_url ? (
                            <img
                              src={selectedPlaylist.image_url}
                              alt={selectedPlaylist.name}
                              className="w-40 h-40 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-40 h-40 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Music className="h-16 w-16 text-primary" />
                            </div>
                          )}

                          <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">
                              {selectedPlaylist.name}
                            </h2>
                            <p className="text-muted-foreground mb-3">
                              {selectedPlaylist.description ||
                                `Playlist based on ${selectedPlaylist.emotional_analysis.primary_mood} mood`}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <div className="flex items-center gap-1 text-sm">
                                <Music className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {selectedPlaylist.track_count} songs
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {formatDate(selectedPlaylist.created_at)}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${getMoodColor(
                                  selectedPlaylist.emotional_analysis
                                    .primary_mood
                                )}/20`}
                              >
                                {
                                  selectedPlaylist.emotional_analysis
                                    .primary_mood
                                }
                              </span>
                              {selectedPlaylist.emotional_analysis
                                .secondary_mood && (
                                <span className="px-3 py-1 bg-secondary rounded-full text-sm">
                                  {
                                    selectedPlaylist.emotional_analysis
                                      .secondary_mood
                                  }
                                </span>
                              )}
                              {selectedPlaylist.emotional_analysis.keywords
                                .slice(0, 3)
                                .map((keyword, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-secondary/60 rounded-full text-sm"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <Button
                                onClick={() =>
                                  handleOpenInSpotify(
                                    selectedPlaylist.external_url
                                  )
                                }
                                className="gap-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Open in Spotify
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleViewAnalysisDetails(selectedPlaylist)
                                }
                                className="gap-2"
                              >
                                View Analysis Details
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold mb-3">
                            Journal Entry
                          </h3>
                          <div className="p-4 bg-secondary/30 rounded-lg mb-6">
                            <p className="whitespace-pre-wrap text-sm">
                              {selectedPlaylist.curhatan_text}
                            </p>
                          </div>

                          <h3 className="text-lg font-semibold mb-3">
                            Mood Analysis
                          </h3>
                          <div className="p-4 bg-secondary/30 rounded-lg">
                            <p className="text-sm mb-3">
                              {
                                selectedPlaylist.emotional_analysis
                                  .mood_description
                              }
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedPlaylist.emotional_analysis.keywords.map(
                                (keyword, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-secondary/80 rounded-full text-xs"
                                  >
                                    {keyword}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-20 bg-secondary/20 rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      {playlists.length === 0
                        ? "You don't have any playlists yet. Create your first one!"
                        : "Select a playlist to view details"}
                    </p>
                    {playlists.length === 0 && (
                      <Button onClick={handleCreateNewPlaylist}>
                        Create Your First Playlist
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">No Playlists Yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You haven't created any mood-based playlists yet. Share how
                you're feeling, and we'll generate a custom playlist just for
                you.
              </p>
              <Button
                onClick={handleCreateNewPlaylist}
                size="lg"
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                Create Your First Playlist
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlaylistPage;
