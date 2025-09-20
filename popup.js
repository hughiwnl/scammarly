// Popup script for Scammarly extension

document.addEventListener('DOMContentLoaded', async () => {
  const errorRateSlider = document.getElementById('errorRateSlider');
  const errorRateValue = document.getElementById('errorRateValue');

  // Load current settings
  const result = await chrome.storage.sync.get(['scammarlyErrorRate']);
  const errorRate = result.scammarlyErrorRate || 0.1;

  // Update UI
  updateSlider(errorRate);

  // Slider change handler
  errorRateSlider.addEventListener('input', async () => {
    const rate = parseInt(errorRateSlider.value) / 100;
    updateSlider(rate);
    
    // Send message to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
      action: 'setErrorRate',
      rate: rate
    });
  });

  function updateSlider(rate) {
    const percentage = Math.round(rate * 100);
    errorRateSlider.value = percentage;
    errorRateValue.textContent = percentage + '%';
  }
});
