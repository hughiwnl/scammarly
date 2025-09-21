// Popup script for Scammarly extension

document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('toggle');

  // Load current settings
  const result = await chrome.storage.sync.get(['scammarlyEnabled']);
  const isEnabled = result.scammarlyEnabled !== false; // Default to true

  // Update UI
  updateToggle(isEnabled);

  // Toggle click handler
  toggle.addEventListener('click', async () => {
    const newState = !toggle.classList.contains('active');
    updateToggle(newState);
    
    // Send message to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
      action: 'toggle',
      enabled: newState
    });
  });

  function updateToggle(enabled) {
    if (enabled) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }
});