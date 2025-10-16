//  completely rewriting this to control Spotify Web Player directly!
// NO OAuth, NO client IDs, NO authentication - just simple browser automation.
document.addEventListener('DOMContentLoaded', () => {
    
    // --- STEP 1:  grabbing all my UI elements ---
    
    const loginView = document.getElementById('login-view');
    const playerView = document.getElementById('player-view');
    const loginButton = document.getElementById('spotify-login');
    const logoutButton = document.getElementById('logout-button');
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const trackInfoDiv = document.getElementById('track-info');
    const statusDiv = document.getElementById('status');

    //  keeping track of whether I found a Spotify tab
    let spotifyTabId = null;

    // --- STEP 2:  creating a function to find the Spotify Web Player tab ---
    
    async function findSpotifyTab() {
        // I'm searching through all open tabs to find one with open.spotify.com
        const tabs = await chrome.tabs.query({ url: 'https://open.spotify.com/*' });
        
        if (tabs.length > 0) {
            // Great! I found a Spotify tab
            spotifyTabId = tabs[0].id;
            console.log('I found a Spotify tab! Tab ID:', spotifyTabId);
            return true;
        } else {
            // No Spotify tab found
            spotifyTabId = null;
            console.log('I couldn\'t find any Spotify tabs open');
            return false;
        }
    }

    // --- STEP 3:  creating a function to send messages to the Spotify tab ---
    
    async function sendToSpotify(action) {
        // First, making sure I have a Spotify tab to talk to
        const hasTab = await findSpotifyTab();
        
        if (!hasTab) {
            console.log('I can\'t send a message because there\'s no Spotify tab!');
            statusDiv.textContent = 'Please open Spotify Web Player';
            return null;
        }

        //  sending the message to my content script running on the Spotify page
        return new Promise((resolve) => {
            chrome.tabs.sendMessage(spotifyTabId, { action: action }, (response) => {
                if (chrome.runtime.lastError) {
                    console.log('I got an error:', chrome.runtime.lastError.message);
                    resolve(null);
                } else {
                    console.log('I got a response:', response);
                    resolve(response);
                }
            });
        });
    }

    // --- STEP 4: creating my control functions ---
    
    async function playPause() {
        console.log('I\'m trying to play or pause the music');
        const response = await sendToSpotify('play-pause');
        
        if (response && response.success) {
            // After clicking play/pause, I'll update the track info to refresh the button
            updateTrackInfo();
        }
    }

    async function skipNext() {
        console.log('I\'m skipping to the next track');
        await sendToSpotify('next');
        // wait a moment for Spotify to change tracks, then update the display
        setTimeout(updateTrackInfo, 500);
    }

    async function skipPrevious() {
        console.log('I\'m going to the previous track');
        await sendToSpotify('previous');
        // wait a moment for Spotify to change tracks, then update the display
        setTimeout(updateTrackInfo, 500);
    }

    // --- STEP 5:  creating a function to get and display the current track ---
    
    async function updateTrackInfo() {
        const response = await sendToSpotify('get-track-info');
        
        if (response && response.success) {
            const { trackInfo } = response;
            
            // updating the display with the current track information
            trackInfoDiv.innerHTML = `
                <strong>${trackInfo.name}</strong><br>
                <em>${trackInfo.artist}</em><br>
                ${trackInfo.albumArt ? `<img src="${trackInfo.albumArt}" width="64" height="64">` : ''}
            `;
            
            //  updating the play/pause button to match what's actually happening
            playPauseButton.textContent = trackInfo.isPlaying ? '❚❚' : '▶';
            statusDiv.textContent = 'Connected to Spotify';
        } else {
            //  couldn't get track info
            trackInfoDiv.innerHTML = 'Unable to get track info';
            statusDiv.textContent = 'Make sure Spotify is playing';
        }
    }

    // --- STEP 6:  creating my "login" function (which just opens Spotify) ---
    
    function openSpotify() {
        //  opening Spotify Web Player in a new tab
        chrome.tabs.create({ url: 'https://open.spotify.com' }, () => {
            console.log('I opened Spotify Web Player!');
            //  wait a moment for it to load, then check if we're connected
            setTimeout(async () => {
                const found = await findSpotifyTab();
                if (found) {
                    updateUI();
                }
            }, 2000);
        });
    }

    // --- STEP 7: creating a function to update which view is shown ---
    
    async function updateUI() {
        //  checking if there's a Spotify tab open
        const hasSpotify = await findSpotifyTab();
        
        if (hasSpotify) {
            // I found Spotify! Show the player controls
            loginView.style.display = 'none';
            playerView.style.display = 'block';
            statusDiv.textContent = 'Connecting to Spotify...';
            //  immediately try to get the current track
            updateTrackInfo();
        } else {
            // No Spotify tab found, show the "open Spotify" button
            loginView.style.display = 'block';
            playerView.style.display = 'none';
            statusDiv.textContent = 'Open Spotify Web Player to start';
        }
    }

    // --- STEP 8:  connecting all my buttons to their functions ---
    
    loginButton.addEventListener('click', openSpotify);
    logoutButton.addEventListener('click', () => {
        // The logout button will just refresh the UI to show the login screen
        spotifyTabId = null;
        updateUI();
    });
    playPauseButton.addEventListener('click', playPause);
    prevButton.addEventListener('click', skipPrevious);
    nextButton.addEventListener('click', skipNext);

    // --- STEP 9:  setting up what happens when the popup opens ---
    
    // When the user opens the popup, check if Spotify is already open
    updateUI();
    
    //  also set up auto-refresh every 5 seconds to keep the track info current
    setInterval(() => {
        if (spotifyTabId) {
            updateTrackInfo();
        }
    }, 5000);
});