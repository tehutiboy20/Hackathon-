//  creating a content script that runs on open.spotify.com
// This will listen for messages from my popup and control the Spotify Web Player directly!

console.log('Spotify Focus Extension: Content script loaded on Spotify Web Player!');

//  setting up a message listener to receive commands from my popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('I received a message:', message);
    
    // checking what action the popup wants me to perform
    if (message.action === 'play-pause') {
        // clicking the play/pause button on the Spotify page
        const playButton = document.querySelector('[data-testid="control-button-playpause"]');
        if (playButton) {
            playButton.click();
            sendResponse({ success: true, message: 'I clicked play/pause!' });
        } else {
            sendResponse({ success: false, message: 'I couldn\'t find the play/pause button' });
        }
    }
    
    else if (message.action === 'next') {
        //  clicking the next track button
        const nextButton = document.querySelector('[data-testid="control-button-skip-forward"]');
        if (nextButton) {
            nextButton.click();
            sendResponse({ success: true, message: 'I skipped to the next track!' });
        } else {
            sendResponse({ success: false, message: 'I couldn\'t find the next button' });
        }
    }
    
    else if (message.action === 'previous') {
        //  clicking the previous track button
        const prevButton = document.querySelector('[data-testid="control-button-skip-back"]');
        if (prevButton) {
            prevButton.click();
            sendResponse({ success: true, message: 'I went to the previous track!' });
        } else {
            sendResponse({ success: false, message: 'I couldn\'t find the previous button' });
        }
    }
    
    else if (message.action === 'get-track-info') {
        // extracting the current track information from the page
        const trackName = document.querySelector('[data-testid="context-item-link"]')?.textContent || 'Unknown Track';
        const artistName = document.querySelector('[data-testid="context-item-info-subtitles"] a')?.textContent || 'Unknown Artist';
        const albumArt = document.querySelector('[data-testid="now-playing-widget"] img')?.src || '';
        
        //  checking if music is currently playing by looking at the play button's state
        const playButton = document.querySelector('[data-testid="control-button-playpause"]');
        const isPlaying = playButton?.getAttribute('aria-label')?.includes('Pause') || false;
        
        sendResponse({
            success: true,
            trackInfo: {
                name: trackName,
                artist: artistName,
                albumArt: albumArt,
                isPlaying: isPlaying
            }
        });
    }
    
    //  returning true to keep the message channel open for async responses
    return true;
});
