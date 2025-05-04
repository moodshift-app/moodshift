
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Music, MessageSquarePlus, BarChart3, PlayCircle, MoonStar, Sun } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-10 left-10 w-56 h-56 bg-accent/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    <span className="gradient-text">MoodShift</span> Music Mapper
                  </h1>
                  <p className="text-xl mb-8 text-muted-foreground">
                    Ceritakan perasaanmu, dan kami akan mencarikan musik yang sesuai dengan moodmu saat ini.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg"
                      className="gap-2"
                      onClick={() => navigate('/journal')}
                    >
                      <MessageSquarePlus className="h-5 w-5" />
                      Mulai Curhat
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="gap-2"
                      onClick={() => window.open('https://open.spotify.com', '_blank')}
                    >
                      <Music className="h-5 w-5" />
                      Connect Spotify
                    </Button>
                  </div>
                </motion.div>
              </div>
              
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative"
                >
                  {/* Music wave animation */}
                  <div className="music-waves mx-auto lg:mx-0 lg:ml-auto">
                    {[...Array(9)].map((_, i) => (
                      <div 
                        key={i} 
                        className="wave" 
                        style={{ '--i': i } as React.CSSProperties}
                      />
                    ))}
                  </div>
                  <div className="glass-card mt-8 max-w-md mx-auto lg:mx-0 lg:ml-auto">
                    <p className="text-sm text-muted-foreground italic mb-4">
                      "Hari ini aku merasa sedikit kecewa karena rencana liburanku gagal. Tapi aku masih bersyukur karena bisa menghabiskan waktu di rumah bersama keluarga."
                    </p>
                    <div className="flex gap-3 mt-6">
                      <div className="px-3 py-1.5 rounded-full bg-mood-sad/20 text-xs">Sedikit sedih</div>
                      <div className="px-3 py-1.5 rounded-full bg-mood-calm/20 text-xs">Tenang</div>
                      <div className="px-3 py-1.5 rounded-full bg-mood-nostalgic/20 text-xs">Reflektif</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Bagaimana Cara Kerjanya</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="card p-6 rounded-xl bg-background shadow-sm"
              >
                <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <MessageSquarePlus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ceritakan Perasaanmu</h3>
                <p className="text-muted-foreground">
                  Tulis apa yang sedang kamu rasakan. Tidak perlu panjang, cukup jujur saja.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card p-6 rounded-xl bg-background shadow-sm"
              >
                <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analisis Emosi</h3>
                <p className="text-muted-foreground">
                  Teknologi kami akan menganalisis emosi dari ceritamu dengan akurat.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="card p-6 rounded-xl bg-background shadow-sm"
              >
                <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <PlayCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dapatkan Playlist</h3>
                <p className="text-muted-foreground">
                  Terima playlist yang direkomendasikan sesuai dengan suasana hatimu saat ini.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Mood Examples */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Playlist untuk Berbagai Mood</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Kami memiliki rekomendasi musik untuk setiap suasana hati, dari yang paling ceria hingga momen reflektif.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mood-card bg-gradient-to-br from-mood-happy/30 to-transparent"
              >
                <h3 className="text-xl font-semibold mb-2">Bahagia & Ceria</h3>
                <p className="text-sm text-muted-foreground mb-4">Musik upbeat untuk merayakan momen bahagia</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Pop</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Dance</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Funk</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mood-card bg-gradient-to-br from-mood-calm/30 to-transparent"
              >
                <h3 className="text-xl font-semibold mb-2">Tenang & Damai</h3>
                <p className="text-sm text-muted-foreground mb-4">Alunan musik lembut untuk menenangkan pikiran</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Ambient</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Acoustic</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Instrumental</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mood-card bg-gradient-to-br from-mood-energetic/30 to-transparent"
              >
                <h3 className="text-xl font-semibold mb-2">Energik & Semangat</h3>
                <p className="text-sm text-muted-foreground mb-4">Musik bertenaga untuk memompa semangat</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Rock</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">EDM</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Hip-Hop</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mood-card bg-gradient-to-br from-mood-sad/30 to-transparent"
              >
                <h3 className="text-xl font-semibold mb-2">Melankolis & Sedih</h3>
                <p className="text-sm text-muted-foreground mb-4">Musik yang menemani saat-saat merenung</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Ballad</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Indie Folk</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Jazz</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mood-card bg-gradient-to-br from-mood-nostalgic/30 to-transparent"
              >
                <h3 className="text-xl font-semibold mb-2">Nostalgia & Kenangan</h3>
                <p className="text-sm text-muted-foreground mb-4">Musik yang membawa kembali ke masa lalu</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Retro</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Classics</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Oldies</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mood-card bg-gradient-to-br from-primary/30 to-transparent"
              >
                <h3 className="text-xl font-semibold mb-2">Fokus & Produktif</h3>
                <p className="text-sm text-muted-foreground mb-4">Musik untuk meningkatkan konsentrasi</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Lofi</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Classical</span>
                  <span className="px-2 py-1 bg-background/20 rounded-full text-xs">Electronic</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-music text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap untuk menemukan musik yang sesuai moodmu?</h2>
              <p className="text-lg mb-8 text-white/80">
                Mulai sekarang dan dapatkan playlist yang dipersonalisasi khusus untukmu
              </p>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/journal')}
              >
                Mulai Sekarang
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Dark Mode Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed right-4 bottom-4 rounded-full"
        onClick={toggleDarkMode}
      >
        {isDarkMode ? 
          <Sun className="h-5 w-5" /> : 
          <MoonStar className="h-5 w-5" />
        }
      </Button>
    </div>
  );
};

export default Index;
