// Background script for Scammarly extension

// Initialize default settings when extension is installed
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      scammarlyEnabled: true,
      scammarlyErrorRate: 0.1
    });
    
    console.log('Scammarly extension installed!');
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup, which is handled by the popup.html
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['scammarlyEnabled', 'scammarlyErrorRate'], (result) => {
      sendResponse({
        enabled: result.scammarlyEnabled !== false,
        errorRate: result.scammarlyErrorRate || 0.1
      });
    });
    return true; // Keep message channel open for async response
  }
});

// Update badge text based on enabled state
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.scammarlyEnabled) {
    const isEnabled = changes.scammarlyEnabled.newValue;
    chrome.action.setBadgeText({
      text: isEnabled ? 'ON' : 'OFF'
    });
    chrome.action.setBadgeBackgroundColor({
      color: isEnabled ? '#4CAF50' : '#ff6b6b'
    });
  }
});

// Set initial badge
chrome.storage.sync.get(['scammarlyEnabled'], (result) => {
  const isEnabled = result.scammarlyEnabled !== false;
  chrome.action.setBadgeText({
    text: isEnabled ? 'ON' : 'OFF'
  });
  chrome.action.setBadgeBackgroundColor({
    color: isEnabled ? '#4CAF50' : '#ff6b6b'
  });
});