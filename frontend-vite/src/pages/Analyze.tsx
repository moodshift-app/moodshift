import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Music2,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { api, isApiError, Playlist } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

const Analyze = () => {
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

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

    const fetchPlaylistData = async () => {
      setLoading(true);

      // Get playlist ID from session storage (set by Journal page)
      const playlistId = sessionStorage.getItem("currentPlaylistId");

      if (!playlistId) {
        // If no playlist ID in session, navigate back to journal
        toast({
          variant: "destructive",
          title: "No playlist found",
          description: "Please create a new journal entry first",
        });
        navigate("/journal");
        return;
      }

      try {
        const response = await api.playlists.getPlaylistById(playlistId);

        if (!isApiError(response)) {
          setPlaylist(response.data);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error || "Failed to load playlist data",
          });
          navigate("/journal");
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
        navigate("/journal");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistData();
  }, [isAuthenticated, navigate, toast]);

  const handleOpenInSpotify = () => {
    if (playlist?.external_url) {
      window.open(playlist.external_url, "_blank");
    }
  };

  const handleCreateNewPlaylist = () => {
    // Clear current playlist from session storage
    sessionStorage.removeItem("currentPlaylistId");
    navigate("/journal");
  };

  const handleViewAllPlaylists = () => {
    navigate("/playlist");
  };

  // Determine mood color based on primary mood
  const getMoodColor = (mood: string | undefined): string => {
    if (!mood) return "bg-primary";

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
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-center">
              Hasil Analisis Mood
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Inilah hasil analisis emosi dari cerita yang kamu berikan
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Menganalisis Emosimu...
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                Tunggu sebentar, kami sedang memproses ceritamu untuk menentukan
                mood dan menemukan musik yang paling cocok untukmu.
              </p>
            </div>
          ) : playlist ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Tabs defaultValue="emotions" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="emotions">Emosi</TabsTrigger>
                  <TabsTrigger value="journal">Journal</TabsTrigger>
                  <TabsTrigger value="playlist">Playlist</TabsTrigger>
                </TabsList>

                <TabsContent value="emotions">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-medium mb-4">
                        Analisis Emosi
                      </h3>

                      <div className="bg-secondary/20 rounded-lg p-4 mb-6">
                        <h4 className="font-medium mb-2">
                          Mood Utama: {playlist.emotional_analysis.primary_mood}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {playlist.emotional_analysis.mood_description}
                        </p>
                        <Progress
                          value={
                            playlist.emotional_analysis.mood_intensity * 100
                          }
                          className={`h-1.5 ${getMoodColor(
                            playlist.emotional_analysis.primary_mood
                          )}`}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            Intensitas
                          </span>
                          <span className="text-xs font-medium">
                            {Math.round(
                              playlist.emotional_analysis.mood_intensity * 100
                            )}
                            %
                          </span>
                        </div>
                      </div>

                      {playlist.emotional_analysis.secondary_mood && (
                        <div className="mb-6">
                          <h4 className="font-medium mb-2">
                            Mood Sekunder:{" "}
                            {playlist.emotional_analysis.secondary_mood}
                          </h4>
                        </div>
                      )}

                      <div className="mt-8">
                        <h3 className="text-xl font-medium mb-4">
                          Kata Kunci yang Terdeteksi
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {playlist.emotional_analysis.keywords.map(
                            (keyword, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-secondary rounded-full text-sm"
                              >
                                {keyword}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-xl font-medium mb-4">
                          Parameter Audio
                        </h3>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Valence (Positivity)
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(
                                  playlist.emotional_analysis.audio_features
                                    .valence * 100
                                )}
                                %
                              </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${
                                    playlist.emotional_analysis.audio_features
                                      .valence * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Energy
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(
                                  playlist.emotional_analysis.audio_features
                                    .energy * 100
                                )}
                                %
                              </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${
                                    playlist.emotional_analysis.audio_features
                                      .energy * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Danceability
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(
                                  playlist.emotional_analysis.audio_features
                                    .danceability * 100
                                )}
                                %
                              </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${
                                    playlist.emotional_analysis.audio_features
                                      .danceability * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Acousticness
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(
                                  playlist.emotional_analysis.audio_features
                                    .acousticness * 100
                                )}
                                %
                              </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${
                                    playlist.emotional_analysis.audio_features
                                      .acousticness * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="journal">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-medium mb-4">
                        Journal Entry
                      </h3>
                      <div className="p-4 bg-secondary/50 rounded-lg text-sm">
                        <p className="whitespace-pre-wrap">
                          {playlist.curhatan_text}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="playlist">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        {playlist.image_url && (
                          <img
                            src={playlist.image_url}
                            alt={playlist.name}
                            className="w-32 h-32 rounded-md"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-medium mb-1">
                            {playlist.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            {playlist.description ||
                              `Generated based on your mood: ${playlist.emotional_analysis.primary_mood}`}
                          </p>
                          <p className="text-sm mb-1">
                            {playlist.track_count} songs
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Created on{" "}
                            {new Date(playlist.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={handleOpenInSpotify}
                        className="w-full gap-2 mb-3"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in Spotify
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleCreateNewPlaylist}
                >
                  <RefreshCw className="h-4 w-4" />
                  Buat Playlist Baru
                </Button>
                <Button className="gap-2" onClick={handleViewAllPlaylists}>
                  <Music2 className="h-4 w-4" />
                  Lihat Semua Playlist
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-center text-muted-foreground">
                No playlist data found. Please create a new journal entry.
              </p>
              <Button onClick={() => navigate("/journal")} className="mt-4">
                Create New Journal Entry
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analyze;
