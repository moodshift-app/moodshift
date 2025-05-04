package models

// EmotionalAnalysis represents the emotion analysis of the user's curhatan text
type EmotionalAnalysis struct {
	PrimaryMood      string            `json:"primary_mood"`
	SecondaryMood    string            `json:"secondary_mood,omitempty"`
	MoodIntensity    float64           `json:"mood_intensity"`
	MoodDescription  string            `json:"mood_description"`
	Keywords         []string          `json:"keywords,omitempty"`
	AudioFeatures    SpotifyAudioFeatures `json:"audio_features"`
}

// SpotifyAudioFeatures represents the Spotify audio features mapped from emotional analysis
type SpotifyAudioFeatures struct {
	Valence    float64 `json:"valence"`    // Musical positiveness (0.0 to 1.0)
	Energy     float64 `json:"energy"`     // Energy level (0.0 to 1.0)
	Tempo      float64 `json:"tempo"`      // Estimated tempo in BPM
	Danceability float64 `json:"danceability"` // Danceability (0.0 to 1.0)
	Acousticness float64 `json:"acousticness"` // Acousticness (0.0 to 1.0)
	Instrumentalness float64 `json:"instrumentalness"` // Instrumentalness (0.0 to 1.0)
}