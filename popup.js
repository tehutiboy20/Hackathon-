document.getElementById('toggle').addEventListener("click", () => {
    // This button is for activating focus mode in your extension.
    // When clicked, it simply shows an alert to the user.
    alert("focus mode activated 🧠");
});

// Step 1: Add an event listener for the Spotify login button.
// This allows users to authenticate with Spotify and get their own access token.
// When the button is clicked, we start the OAuth flow.
document.getElementById('spotify-login').addEventListener("click", () => {
    // Step 2: Define your Spotify app's client ID.
    // You must register your app at https://developer.spotify.com/dashboard/applications to get this.
    // The client ID uniquely identifies your app to Spotify.
    const clientId = "670cc3b01dce48e6aa112dba2b770741"; // <-- Replace with your actual client ID

    // Step 3: Define the redirect URI.
    // This URI is where Spotify will send the user after they log in and approve permissions.
    // It must match one of the redirect URIs you set in your Spotify app settings.
    // For GitHub Pages, use the full path to your callback.html file.
    // This allows your extension to receive the token securely.
    const redirectUri = "https://tehutiboy20.github.io/Hackathon-/callback.html"; // <-- Must match Spotify dashboard and be accessible

    // Step 4: Define the scopes your app needs.
    // Scopes specify what permissions your app is requesting from the user.
    // For example, 'playlist-read-private' lets you read the user's private playlists,
    // and 'user-read-playback-state' lets you read the user's playback state.
    // You can add more scopes as needed for your app's features.
    const scopes = "playlist-read-private user-read-playback-state";

    // Step 5: Build the Spotify authorization URL.
    // This URL will redirect the user to Spotify's login page and ask for permission.
    // The URL includes your client ID, response type (token for implicit flow),
    // redirect URI, and requested scopes.
    // After the user logs in and approves, Spotify will redirect to your URI
    // with the access token in the URL fragment (#access_token=...).
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

    // Step 6: Open the authorization URL in a popup window.
    // This is important: opening a popup window from the extension allows Chrome to permit the redirect to your extension page.
    // The popup window will be used for the OAuth flow and will close automatically after authentication.
    const width = 500;
    const height = 700;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    // Open the Spotify login page in a centered popup window.
    const authWindow = window.open(
        authUrl,
        "Spotify Login",
        `width=${width},height=${height},top=${top},left=${left}`
    );

    // Step 7: Set up a timer to check when the popup window closes.
    // When the window closes, we can reload the popup to update the UI with the new token.
    // This is a simple way to refresh the extension state after authentication.
    const pollTimer = window.setInterval(function () {
        if (authWindow.closed) {
            window.clearInterval(pollTimer);
            // Reload the popup to trigger token usage (e.g., fetch tracks)
            window.location.reload();
        }
    }, 500);
});