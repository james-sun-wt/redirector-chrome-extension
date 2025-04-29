# URL Redirect Manager - Chrome Extension

A flexible Chrome extension that allows users to configure custom domain redirects through a simple GUI interface.

## Features

- Create multiple URL redirect rules
- Easy-to-use graphical interface
- Real-time rule updates
- Persistent storage of rules across sessions
- Chrome sync support for rules across devices

## Installation

### Developer Mode (Loading Unpacked)
1. Clone this repository:
    ```bash
    git clone https://github.com/james-sun-wt/redirector-chrome-extension.git
    ```
2. Open Chrome and navigate to chrome://extensions/
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage
1. Click the extension icon in the Chrome toolbar to open the configuration popup
2. Click "Add New Rule" to create a new redirect rule
3. For each rule:
   - Enter the source domain in the "From domain" field (e.g., "teamcity.corporate.com")
   - Enter the target domain in the "To domain" field (e.g., "teamcity.enterprise.io")
   - Rules are saved automatically when modified
4. Use the delete button to remove unwanted rules