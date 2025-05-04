import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Smile,
  Frown,
  Zap,
  Sparkle,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api, isApiError } from "@/lib/api";

const Journal = () => {
  const [journal, setJournal] = useState("");
  const [language, setLanguage] = useState("id");
  const [intensity, setIntensity] = useState([50]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (journal.trim().length < 20) {
      toast({
        variant: "destructive",
        title: "Input terlalu pendek",
        description: "Cerita minimal harus terdiri dari 20 karakter.",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "Please connect your Spotify account first.",
      });
      return;
    }

    setLoading(true);

    try {
      // Custom playlist name based on current date
      const now = new Date();
      const playlistName = `MoodShift ${now.toLocaleDateString()}`;

      // Send data to API to create playlist
      const response = await api.playlists.createPlaylist(
        journal,
        playlistName
      );

      if (!isApiError(response)) {
        // Store playlist ID in session storage for analyze page to retrieve
        sessionStorage.setItem("currentPlaylistId", response.data.id);

        toast({
          title: "Analisis berhasil",
          description: "Playlist berdasarkan mood kamu telah dibuat!",
        });

        // Navigate to analyze page
        navigate("/analyze");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to create playlist.",
        });
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectSpotify = () => {
    // Redirect to Spotify auth
    window.location.href = api.auth.getSpotifyAuthUrl();
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
              Ceritakan Perasaanmu
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Tulis apa yang kamu pikirkan atau rasakan saat ini, dan kami akan
              menganalisis emosimu
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-md">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Journal Entry</CardTitle>
                  <CardDescription>
                    Ceritakan apa yang kamu rasakan hari ini. Minimal 20
                    karakter untuk analisis yang akurat.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <Textarea
                      placeholder="Contoh: Hari ini aku merasa senang karena bertemu teman lama. Kami membicarakan banyak hal dan itu membuatku nostalgia..."
                      className="min-h-[200px] resize-none"
                      value={journal}
                      onChange={(e) => setJournal(e.target.value)}
                      disabled={loading}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Minimum 20 karakter</span>
                      <span
                        className={
                          journal.length < 20 ? "text-destructive" : ""
                        }
                      >
                        {journal.length} karakter
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Bahasa</Label>
                      <RadioGroup
                        defaultValue="id"
                        className="flex space-x-4 mt-2"
                        value={language}
                        onValueChange={setLanguage}
                        disabled={loading}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="id" id="id" />
                          <Label htmlFor="id" className="cursor-pointer">
                            Indonesia
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="en" id="en" />
                          <Label htmlFor="en" className="cursor-pointer">
                            English
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <Label>Intensitas Emosi</Label>
                        <span className="text-sm text-muted-foreground">
                          {intensity[0]}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <Frown className="h-4 w-4 text-muted-foreground" />
                        <Slider
                          defaultValue={[50]}
                          max={100}
                          step={1}
                          className="flex-1"
                          value={intensity}
                          onValueChange={setIntensity}
                          disabled={loading}
                        />
                        <Zap className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="border rounded-lg p-4 flex flex-col items-center gap-1 text-center cursor-pointer hover:bg-secondary transition-colors">
                      <Smile className="h-6 w-6 mb-2 text-mood-happy" />
                      <span className="text-sm font-medium">Senang</span>
                      <span className="text-xs text-muted-foreground">
                        Pop, Dance
                      </span>
                    </div>
                    <div className="border rounded-lg p-4 flex flex-col items-center gap-1 text-center cursor-pointer hover:bg-secondary transition-colors">
                      <Sparkle className="h-6 w-6 mb-2 text-mood-calm" />
                      <span className="text-sm font-medium">Tenang</span>
                      <span className="text-xs text-muted-foreground">
                        Ambient, Lo-fi
                      </span>
                    </div>
                    <div className="border rounded-lg p-4 flex flex-col items-center gap-1 text-center cursor-pointer hover:bg-secondary transition-colors">
                      <Clock className="h-6 w-6 mb-2 text-mood-nostalgic" />
                      <span className="text-sm font-medium">Nostalgia</span>
                      <span className="text-xs text-muted-foreground">
                        Classics, Jazz
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  {isAuthenticated ? (
                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Menganalisis...
                        </>
                      ) : (
                        <>
                          Analisis Emosiku
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleConnectSpotify}
                      className="w-full gap-2"
                    >
                      Connect Spotify to Continue
                    </Button>
                  )}
                </CardFooter>
              </form>
            </Card>
          </motion.div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Privasi kamu adalah prioritas kami. Ceritamu hanya digunakan untuk
              menganalisis emosi.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Journal;
