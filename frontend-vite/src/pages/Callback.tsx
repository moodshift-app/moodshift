import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Loader2, Home } from "lucide-react";

const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(`Authentication error: ${errorParam}`);
        setLoading(false);
        return;
      }

      if (!code) {
        setError("No authorization code found in the URL");
        setLoading(false);
        return;
      }

      try {
        const success = await login(code);

        if (success) {
          navigate("/journal");
        } else {
          setError("Failed to authenticate with Spotify");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("An unexpected error occurred during authentication");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [location, login, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h1 className="text-2xl font-bold mb-2">Connecting with Spotify...</h1>
        <p className="text-muted-foreground">
          Please wait while we authenticate your account
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-destructive/10 border border-destructive rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4 text-destructive">
            Authentication Failed
          </h1>
          <p className="mb-4">{error}</p>
        </div>
        <Button onClick={() => navigate("/")} className="gap-2">
          <Home className="h-4 w-4" />
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
      <p className="text-muted-foreground">Almost there!</p>
    </div>
  );
};

export default Callback;
