// Step 1: Store your Spotify API Token securely.
// This token is required for authentication with the Spotify Web API.
// You must obtain it using Spotify's OAuth flow. Never expose your token in production!
const Spotify_Token = localStorage.getItem('spotify_token');

// Step 2: Specify the Playlist ID you want to fetch tracks from.
// To get this ID, copy the playlist link from Spotify and use the part after '/playlist/'.
const Playlist_Id = "37i9dQZF1EIfjzgnbx4yqL"; // Only the playlist ID, not the full URL

// Step 3: Define the Spotify API endpoint for fetching playlist tracks.
// This endpoint will return the tracks in the specified playlist.
const Spotify_API_URL = `https://api.spotify.com/v1/playlists/${Playlist_Id}/tracks`;

// Step 4: Variables to keep track of the current track and all tracks.
// 'tracks' will hold the playlist's tracks, 'currentTrackIndex' tracks which track is shown.
let tracks = [];
let currentTrackIndex = 0;

// Step 5: Function to update the track info in the popup UI.
// This function displays the current track's name, artist(s), and album art.
// If no tracks are loaded, it shows a message.
function updateTrackInfo() {
    const trackInfoDiv = document.getElementById("track-info");
    if (tracks.length === 0) {
        trackInfoDiv.innerHTML = "No tracks loaded.";
        return;
    }
    // Get the current track object from the tracks array.
    const track = tracks[currentTrackIndex].track;
    // Display track name, artists, and album image.
    trackInfoDiv.innerHTML = `
        <strong>${track.name}</strong><br>
        <em>${track.artists.map(a => a.name).join(", ")}</em><br>
        <img src="${track.album.images[2]?.url || track.album.images[0]?.url}" width="64" height="64">
    `;
}

// Step 6: Fetch tracks from the playlist and initialize the player.
// This async function requests the playlist tracks from Spotify and stores them.
// It also handles errors and updates the UI accordingly.
async function fetchPlaylistTracks() {
    const trackInfoDiv = document.getElementById("track-info");
    try {
        // Make a GET request to the Spotify API with the Bearer token for authentication.
        const response = await fetch(Spotify_API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Spotify_Token}`,
                "Content-Type": "application/json"
            }
        });

        // If the response is not OK, display an error message in the popup.
        if (!response.ok) {
            trackInfoDiv.innerHTML = `Error: ${response.status} ${response.statusText}<br>Check your token.`;
            return;
        }

        // Parse the response JSON to get the playlist data.
        const data = await response.json();
        // Store the tracks array from the response.
        tracks = data.items;
        // If no tracks are found, show a message.
        if (tracks.length === 0) {
            trackInfoDiv.innerHTML = "No tracks found in playlist.";
            return;
        }
        // Set the current track index to the first track and update the UI.
        currentTrackIndex = 0;
        updateTrackInfo();
    } catch (error) {
        // If there is a network or other error, display a message and log the error.
        trackInfoDiv.innerHTML = "Failed to fetch tracks. Check your network and token.";
        console.error(error);
    }
}

// Step 7: Add event listeners for previous, play, and next buttons.
// These allow the user to cycle through tracks and open the current track in Spotify.

// When the 'prev' button is clicked, show the previous track (wraps around to last track).
document.getElementById("prev").addEventListener("click", () => {
    if (tracks.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    updateTrackInfo();
});

// When the 'next' button is clicked, show the next track (wraps around to first track).
document.getElementById("next").addEventListener("click", () => {
    if (tracks.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    updateTrackInfo();
});

// When the 'play' button is clicked, open the current track in Spotify's web player.
document.getElementById("play").addEventListener("click", () => {
    if (tracks.length === 0) return;
    const track = tracks[currentTrackIndex].track;
    window.open(track.external_urls.spotify, "_blank");
});

// Step 8: Fetch tracks when the popup loads.
// This initializes the player and displays the first track.
fetchPlaylistTracks();