// Scammarly - Content Script
// This script runs on all web pages and adds random typing errors

class Scammarly {
  constructor() {
    this.isEnabled = false;
    this.errorRate = 0.05; // 5% chance of adding an error (1/20 times)
    this.typoTypes = [
      'duplicate_letter',
      'missing_letter', 
      'wrong_letter',
      'transpose_letters',
      'extra_space',
      'missing_space',
      'add_punctuation',
      'add_number',
      'remove_punctuation',
      'wrong_punctuation'
    ];
    
    // Track keystrokes to ensure random distribution
    this.keystrokeCount = 0;
    this.typoInterval = Math.floor(1 / this.errorRate); // Average keystrokes between typos
    
    this.init();
  }

  async init() {
    console.log('Scammarly: Initializing...');
    // Load settings from storage
    const result = await chrome.storage.sync.get(['scammarlyEnabled', 'scammarlyErrorRate']);
    this.isEnabled = result.scammarlyEnabled !== false; // Default to true
    this.errorRate = 0.05; // Hard set to 5% (1/20 times)
    
    console.log('Scammarly: Settings loaded', { enabled: this.isEnabled, errorRate: this.errorRate });
    
    if (this.isEnabled) {
      this.startTypoGeneration();
      console.log('Scammarly: Typo generation started');
    }
  }

  startTypoGeneration() {
    // Listen for input events on all input elements
    document.addEventListener('input', this.handleInput.bind(this));
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Additional listeners for Google Docs and rich text editors
    document.addEventListener('keyup', this.handleKeyup.bind(this));
    document.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
    
    // Listen for changes in Google Docs specifically
    this.setupGoogleDocsListener();
  }

  setupGoogleDocsListener() {
    // Use MutationObserver to detect changes in Google Docs
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          // Check if the mutation is in a text input area
          const target = mutation.target;
          if (this.isTextInput(target) || this.isTextInput(target.parentElement)) {
            // Small delay to let Google Docs finish its processing
            setTimeout(() => {
              if (Math.random() < this.errorRate) {
                this.addTypoToElement(target);
              }
            }, 100);
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  addTypoToElement(element) {
    const textElement = this.findTextElement(element);
    if (textElement) {
      this.addTypo(textElement);
    }
  }

  findTextElement(element) {
    // Walk up the DOM tree to find the actual text input element
    let current = element;
    while (current && current !== document.body) {
      if (this.isTextInput(current)) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  handleKeyup(event) {
    if (!this.isEnabled) {
      return;
    }

    const target = event.target;
    if (this.isTextInput(target) && event.key.length === 1) {
      this.keystrokeCount++;
      
      // Check if it's time for a typo (with some randomness)
      const shouldAddTypo = this.keystrokeCount >= this.typoInterval && Math.random() < 0.3;
      
      if (shouldAddTypo) {
        this.keystrokeCount = 0; // Reset counter
        // Small delay for Google Docs
        setTimeout(() => this.addTypo(target), 50);
      }
    }
  }

  handleCompositionEnd(event) {
    if (!this.isEnabled) {
      return;
    }

    const target = event.target;
    if (this.isTextInput(target)) {
      this.keystrokeCount++;
      
      // Check if it's time for a typo (with some randomness)
      const shouldAddTypo = this.keystrokeCount >= this.typoInterval && Math.random() < 0.3;
      
      if (shouldAddTypo) {
        this.keystrokeCount = 0; // Reset counter
        setTimeout(() => this.addTypo(target), 100);
      }
    }
  }

  handleInput(event) {
    if (!this.isEnabled) {
      return;
    }

    const target = event.target;
    console.log('Scammarly: Input detected on', target.tagName, target.type);
    if (this.isTextInput(target)) {
      this.keystrokeCount++;
      
      // Check if it's time for a typo (with some randomness)
      const shouldAddTypo = this.keystrokeCount >= this.typoInterval && Math.random() < 0.3;
      
      if (shouldAddTypo) {
        this.keystrokeCount = 0; // Reset counter
        console.log('Scammarly: Adding typo to text input');
        this.addTypo(target);
      }
    }
  }

  handleKeydown(event) {
    if (!this.isEnabled) {
      return;
    }

    const target = event.target;
    if (this.isTextInput(target) && event.key.length === 1) {
      this.keystrokeCount++;
      
      // Check if it's time for a typo (with some randomness)
      const shouldAddTypo = this.keystrokeCount >= this.typoInterval && Math.random() < 0.3;
      
      if (shouldAddTypo) {
        this.keystrokeCount = 0; // Reset counter
        // Small delay to let the character be inserted first
        setTimeout(() => this.addTypo(target), 10);
      }
    }
  }

  isTextInput(element) {
    const tagName = element.tagName.toLowerCase();
    const inputType = element.type ? element.type.toLowerCase() : '';
    
    // Check for Google Docs specific elements
    const isGoogleDocs = this.isGoogleDocsElement(element);
    
    return (
      tagName === 'input' && 
      ['text', 'email', 'password', 'search', 'url', 'tel'].includes(inputType)
    ) || 
    tagName === 'textarea' ||
    element.contentEditable === 'true' ||
    element.isContentEditable ||
    isGoogleDocs;
  }

  isGoogleDocsElement(element) {
    // Check for Google Docs specific selectors
    const googleDocsSelectors = [
      '[contenteditable="true"]',
      '.docs-texteventtarget-iframe',
      '[role="textbox"]',
      '.kix-appview-editor',
      '.kix-lineview-text-block',
      '.kix-wordhtmlgenerator-word-node'
    ];
    
    // Check if element matches any Google Docs selector
    for (const selector of googleDocsSelectors) {
      if (element.matches && element.matches(selector)) {
        return true;
      }
    }
    
    // Check if element is inside a Google Docs container
    const googleDocsContainers = [
      '.docs-texteventtarget-iframe',
      '.kix-appview-editor',
      '[data-google-docs-editor]'
    ];
    
    for (const container of googleDocsContainers) {
      if (element.closest && element.closest(container)) {
        return true;
      }
    }
    
    return false;
  }

  addTypo(element) {
    const currentValue = this.getValue(element);
    if (currentValue.length === 0) return;

    const typoType = this.typoTypes[Math.floor(Math.random() * this.typoTypes.length)];
    const newValue = this.applyTypo(currentValue, typoType);
    
    if (newValue !== currentValue) {
      this.setValue(element, newValue);
      this.showTypoIndicator(element);
    }
  }

  applyTypo(text, typoType) {
    if (text.length === 0) return text;

    const position = Math.floor(Math.random() * text.length);
    const char = text[position];

    switch (typoType) {
      case 'duplicate_letter':
        return text.slice(0, position) + char + char + text.slice(position + 1);
      
      case 'missing_letter':
        return text.slice(0, position) + text.slice(position + 1);
      
      case 'wrong_letter':
        const wrongChar = this.getRandomWrongChar(char);
        return text.slice(0, position) + wrongChar + text.slice(position + 1);
      
      case 'transpose_letters':
        if (position < text.length - 1) {
          const chars = text.split('');
          [chars[position], chars[position + 1]] = [chars[position + 1], chars[position]];
          return chars.join('');
        }
        return text;
      
      case 'extra_space':
        return text.slice(0, position) + ' ' + text.slice(position);
      
      case 'missing_space':
        if (text[position] === ' ') {
          return text.slice(0, position) + text.slice(position + 1);
        }
        return text;
      
      case 'add_punctuation':
        const punctuation = this.getRandomPunctuation();
        return text.slice(0, position) + punctuation + text.slice(position);
      
      case 'add_number':
        const number = this.getRandomNumber();
        return text.slice(0, position) + number + text.slice(position);
      
      case 'remove_punctuation':
        if (this.isPunctuation(char)) {
          return text.slice(0, position) + text.slice(position + 1);
        }
        return text;
      
      case 'wrong_punctuation':
        if (this.isPunctuation(char)) {
          const wrongPunctuation = this.getRandomPunctuation();
          return text.slice(0, position) + wrongPunctuation + text.slice(position + 1);
        }
        return text;
      
      default:
        return text;
    }
  }

  getRandomWrongChar(originalChar) {
    const nearbyKeys = {
      'a': 's', 'b': 'v', 'c': 'x', 'd': 'f', 'e': 'r', 'f': 'g', 'g': 'h',
      'h': 'j', 'i': 'o', 'j': 'k', 'k': 'l', 'l': ';', 'm': 'n', 'n': 'm',
      'o': 'p', 'p': '[', 'q': 'w', 'r': 't', 's': 'd', 't': 'y', 'u': 'i',
      'v': 'c', 'w': 'e', 'x': 'z', 'y': 'u', 'z': 'x'
    };
    
    const lowerChar = originalChar.toLowerCase();
    return nearbyKeys[lowerChar] || originalChar;
  }

  getRandomPunctuation() {
    const punctuation = ['.', ',', '!', '?', ';', ':', '-', '_', '(', ')', '[', ']', '{', '}', '"', "'", '`', '~', '@', '#', '$', '%', '^', '&', '*', '+', '=', '|', '\\', '/', '<', '>'];
    return punctuation[Math.floor(Math.random() * punctuation.length)];
  }

  getRandomNumber() {
    return Math.floor(Math.random() * 10).toString();
  }

  isPunctuation(char) {
    const punctuation = '.,!?;:-_()[]{}"\'`~@#$%^&*+=|\\/<>';
    return punctuation.includes(char);
  }

  getValue(element) {
    if (element.contentEditable === 'true' || element.isContentEditable) {
      return element.textContent || element.innerText || '';
    }
    return element.value || '';
  }

  setValue(element, value) {
    if (element.contentEditable === 'true' || element.isContentEditable) {
      // For Google Docs and other rich text editors, we need to be more careful
      this.setContentEditableValue(element, value);
    } else {
      element.value = value;
    }
    
    // Trigger input event to notify other scripts
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }

  setContentEditableValue(element, value) {
    // Save current selection
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    
    // Set the text content
    element.textContent = value;
    
    // Restore selection to end of text
    if (range) {
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  showTypoIndicator(element) {
    // Add a subtle visual indicator that a typo was added
    element.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.3)';
    setTimeout(() => {
      element.style.boxShadow = '';
    }, 200);
  }

  // Public methods for popup control
  setEnabled(enabled) {
    this.isEnabled = enabled;
    chrome.storage.sync.set({ scammarlyEnabled: enabled });
    
    if (enabled) {
      this.startTypoGeneration();
      console.log('Scammarly: Typo generation started');
    } else {
      console.log('Scammarly: Typo generation stopped');
    }
  }

  setErrorRate(rate) {
    this.errorRate = 0.05; // Hard set to 5% (1/20 times)
    chrome.storage.sync.set({ scammarlyErrorRate: this.errorRate });
  }
}

// Initialize Scammarly
const scammarly = new Scammarly();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    scammarly.setEnabled(request.enabled);
    sendResponse({ success: true });
  } else if (request.action === 'setErrorRate') {
    scammarly.setErrorRate(request.rate);
    sendResponse({ success: true });
  } else if (request.action === 'getStatus') {
    sendResponse({ 
      enabled: scammarly.isEnabled, 
      errorRate: scammarly.errorRate 
    });
  }
});
