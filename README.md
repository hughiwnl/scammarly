# Scammarly - The Anti-Grammarly Chrome Extension

A Chrome extension that randomly adds typing errors to your text input, like Grammarly but in reverse! Perfect for pranks, testing, or just adding some chaos to your typing experience.

## Features

- **Random Typo Generation**: Adds various types of typing errors including:
  - Duplicate letters (hello → helllo)
  - Missing letters (hello → helo)
  - Wrong letters using nearby keyboard keys (hello → hwllo)
  - Transposed letters (hello → hlelo)
  - Extra spaces (hello → he llo)
  - Missing spaces (hello world → helloworld)

- **Adjustable Error Rate**: Control how often typos are added (0-50%)
- **Smart Detection**: Works on all text inputs, textareas, and contentEditable elements
- **Visual Feedback**: Subtle red glow when a typo is added
- **Easy Toggle**: Simple on/off switch in the extension popup
- **Badge Indicator**: Shows "ON"/"OFF" status in the extension icon

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the scammarly folder
5. The extension should now appear in your extensions list

## Usage

1. Click the Scammarly extension icon in your browser toolbar
2. Toggle the extension on/off using the switch
3. Adjust the error rate using the slider (0-50%)
4. Start typing in any text field - typos will be randomly added!

## Files Structure

- `manifest.json` - Extension configuration
- `content.js` - Main script that adds typos to web pages
- `content.css` - Styles for visual feedback
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality
- `background.js` - Background service worker
- `icons/` - Extension icons (you'll need to add these)

## How It Works

The extension uses a content script that:
1. Listens for input events on all text input elements
2. Randomly decides whether to add a typo based on the error rate
3. Applies one of six different typo types
4. Provides visual feedback when a typo is added
5. Preserves the original functionality of the input field

## Privacy

This extension:
- Only runs on web pages you visit
- Does not collect or transmit any data
- All settings are stored locally in Chrome's sync storage
- No external servers or APIs are used

## Warning

This extension is for entertainment purposes only! Be careful when using it on important forms, emails, or documents where accuracy matters.

## License

MIT License - Feel free to modify and distribute!
