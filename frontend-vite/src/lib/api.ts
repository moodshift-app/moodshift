// API service for MoodShift application
// Handles all interactions with the backend API

const API_BASE_URL = "https://api.moodshift.fuadfakhruz.id/api/v1";

// Types based on the API documentation
export interface User {
  id: string;
  spotify_id: string;
  display_name: string;
  email: string;
  profile_image_url: string;
  created_at: string;
  updated_at: string;
}

export interface SpotifyAudioFeatures {
  valence: number;
  energy: number;
  tempo: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
}

export interface EmotionalAnalysis {
  primary_mood: string;
  secondary_mood: string;
  mood_intensity: number;
  mood_description: string;
  keywords: string[];
  audio_features: SpotifyAudioFeatures;
}

export interface Playlist {
  id: string;
  user_id: string;
  spotify_id: string;
  name: string;
  description: string;
  curhatan_text: string;
  emotional_analysis: EmotionalAnalysis;
  track_count: number;
  image_url: string;
  external_url: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

// Helper to check if the response is an error
export const isApiError = (
  response: ApiResponse<unknown> | ApiError
): response is ApiError => {
  return !response.success;
};

// Get the stored auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("moodshift_token");
};

// Set the auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem("moodshift_token", token);
};

// Clear the auth token (logout)
export const clearAuthToken = (): void => {
  localStorage.removeItem("moodshift_token");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Fetch wrapper with authentication
const fetchWithAuth = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T> | ApiError> => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "An unknown error occurred",
      };
    }

    return data as ApiResponse<T>;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
};

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    // Get Spotify auth URL
    getSpotifyAuthUrl: (): string => {
      return `${API_BASE_URL}/auth/spotify`;
    },

    // Handle the callback from Spotify
    handleCallback: async (
      code: string
    ): Promise<ApiResponse<{ token: string; user: User }> | ApiError> => {
      return fetchWithAuth<{ token: string; user: User }>(
        `/auth/callback?code=${code}`
      );
    },

    // Get current user profile
    getCurrentUser: async (): Promise<ApiResponse<User> | ApiError> => {
      return fetchWithAuth<User>("/auth/me");
    },
  },

  // Playlist endpoints
  playlists: {
    // Create a new playlist
    createPlaylist: async (
      curhatanText: string,
      playlistName?: string
    ): Promise<ApiResponse<Playlist> | ApiError> => {
      return fetchWithAuth<Playlist>("/playlists", {
        method: "POST",
        body: JSON.stringify({
          curhatan_text: curhatanText,
          playlist_name: playlistName,
        }),
      });
    },

    // Get all playlists for the current user
    getUserPlaylists: async (): Promise<ApiResponse<Playlist[]> | ApiError> => {
      return fetchWithAuth<Playlist[]>("/playlists");
    },

    // Get a specific playlist by ID
    getPlaylistById: async (
      id: string
    ): Promise<ApiResponse<Playlist> | ApiError> => {
      return fetchWithAuth<Playlist>(`/playlists/${id}`);
    },
  },
};
