import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Music, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginClick = () => {
    // Redirect to Spotify auth page
    window.location.href = api.auth.getSpotifyAuthUrl();
  };

  return (
    <header className="border-b py-4 px-4 md:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-1.5">
              <Music className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">MoodShift</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/journal"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Journal
            </Link>
            {isAuthenticated && (
              <Link
                to="/playlist"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                My Playlists
              </Link>
            )}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      {user?.profile_image_url ? (
                        <AvatarImage
                          src={user.profile_image_url}
                          alt={user.display_name}
                        />
                      ) : (
                        <AvatarFallback>
                          {user?.display_name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.display_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/playlist")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Playlists</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLoginClick}>Connect Spotify</Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b z-30">
          <div className="container mx-auto py-4 px-4">
            <nav className="flex flex-col gap-4 mb-6">
              <Link
                to="/"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/journal"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Journal
              </Link>
              {isAuthenticated && (
                <Link
                  to="/playlist"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Playlists
                </Link>
              )}
            </nav>

            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar>
                      {user?.profile_image_url ? (
                        <AvatarImage
                          src={user.profile_image_url}
                          alt={user.display_name}
                        />
                      ) : (
                        <AvatarFallback>
                          {user?.display_name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user?.display_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <Button onClick={handleLoginClick} className="flex-1">
                  Connect Spotify
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
