// document.getElementById('toggle').addEventListener("click", () => {
//     // This button is for activating focus mode in your extension.
//     // When clicked, it simply shows an alert to the user.
//     alert("focus mode activated 🧠");
// });

// Step 1: DOMContentLoaded event listener
// This ensures the script runs only after the full HTML document has been loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {
    // Step 2: Define constants and get UI elements
    // We define the client ID and redirect URI here.
    // Remember to keep your actual client ID from the Spotify dashboard.
    const clientId = '670cc3b0f1dc4e86aa1f2dba2b770741'; // Your client ID
    const redirectUri = 'https://tehutiboy20.github.io/Hackathon-/callback.html';

    // Get references to all the buttons and divs in the popup
    const loginView = document.getElementById('login-view');
    const playerView = document.getElementById('player-view');
    const loginButton = document.getElementById('spotify-login');
    const logoutButton = document.getElementById('logout-button');
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const trackInfoDiv = document.getElementById('track-info');
    const statusDiv = document.getElementById('status');

    let spotifyToken = null; // Variable to hold the token

    // Step 3: Function to make authenticated API calls to Spotify
    // This is a helper function to avoid repeating headers and error handling.
    async function spotifyApiRequest(endpoint, method = 'GET', body = null) {
        if (!spotifyToken) {
            console.error('No Spotify token available.');
            return null;
        }

        const res = await fetch(`https://api.spotify.com/v1/me/player/play${endpoint}`, {
            method,
            headers: { 'Authorization': `Bearer ${spotifyToken}` },
            body: body ? JSON.stringify(body) : null
        });

        // If token is expired (401), log the user out.
        if (res.status === 401) {
            logout();
            return null;
        }
        // For requests that don't return content (like play/pause), a 204 status is success.
        if (res.status === 204) {
            return true;
        }
        return res.json();
    }

    // Step 4: Player control functions
    // These functions call the Spotify API to control playback.
    async function playPause() {
        const playerState = await spotifyApiRequest('me/player');
        // If music is currently playing, pause it. Otherwise, play it.
        if (playerState && playerState.is_playing) {
            await spotifyApiRequest('me/player/pause', 'PUT');
            playPauseButton.textContent = '▶';
        } else {
            await spotifyApiRequest('me/player/play', 'PUT');
            playPauseButton.textContent = '❚❚';
        }
    }

    // Skip to the previous or next track
    const skipPrev = () => spotifyApiRequest('me/player/previous', 'POST');
    const skipNext = () => spotifyApiRequest('me/player/next', 'POST');

    // Step 5: Function to update the track info in the UI
    // This fetches the currently playing track and displays its details.
    async function updateTrackInfo() {
        const data = await spotifyApiRequest('me/player/currently-playing');
        if (data && data.item) {
            trackInfoDiv.innerHTML = `
                <strong>${data.item.name}</strong><br>
                <em>${data.item.artists.map(a => a.name).join(', ')}</em><br>
                <img src="${data.item.album.images[2]?.url}" width="64" height="64">
            `;
            // Update the play/pause button based on the current playback state
            playPauseButton.textContent = data.is_playing ? '❚❚' : '▶';
        } else {
            trackInfoDiv.innerHTML = 'No song is currently playing.';
            playPauseButton.textContent = '▶';
        }
    }

    // Step 6: UI update function
    // This function checks if a token exists and shows the correct view (login or player).
    function updateUI() {
        if (spotifyToken) {
            loginView.style.display = 'none';
            playerView.style.display = 'block';
            updateTrackInfo(); // Fetch track info as soon as we know we're logged in
        } else {
            loginView.style.display = 'block';
            playerView.style.display = 'none';
        }
    }

    // Step 7: Login and Logout functions
    function login() {
        // We need permissions to read and control playback.
        const scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing';
        const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=$${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
        
        // Open the Spotify login page in a new tab.
        chrome.tabs.create({ url: authUrl });
    }

    function logout() {
        // Remove the token from storage and update the UI.
        chrome.storage.local.remove('spotify_token', () => {
            spotifyToken = null;
            updateUI();
        });
    }

    // Step 8: Add event listeners to all the buttons
    loginButton.addEventListener('click', login);
    logoutButton.addEventListener('click', logout);
    playPauseButton.addEventListener('click', playPause);
    prevButton.addEventListener('click', skipPrev);
    nextButton.addEventListener('click', skipNext);

    // Step 9: Initialization logic
    // When the popup opens, check chrome.storage for a token.
    chrome.storage.local.get('spotify_token', (result) => {
        if (result.spotify_token) {
            spotifyToken = result.spotify_token;
        }
        updateUI(); // Update the UI based on whether a token was found.
    });
});