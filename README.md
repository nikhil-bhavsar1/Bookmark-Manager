# Bookmark Manager

A modern, beautiful bookmark manager built with React, TypeScript, and Vite. Features a glassmorphism UI, localStorage persistence, and powerful import/export capabilities.

## Features

### ✨ Core Features
- **LocalStorage Persistence**: All bookmarks are automatically saved to browser localStorage
- **Beautiful UI**: Modern glassmorphism design with smooth animations
- **Nested Collections**: Organize bookmarks in folders and subfolders
- **Multiple View Modes**: Grid (sm/md/lg), List, and Carousel views
- **Smart Search**: Real-time bookmark search across titles, URLs, and descriptions
- **Tags Support**: Add and filter by tags
- **Sorting Options**: Sort by name or date (ascending/descending)

### 📥 Import/Export
Support for multiple file formats with intelligent parsing:

#### Import Formats
- **JSON**: Direct bookmark data import
- **Markdown**: Automatically detects headers (#, ##, ###) and creates nested folders
  - Supports `[Title](URL)` links
  - Plain URL detection in list items
  - Converts sections into organized folder structure
- **CSV**: Parses structured data with optional headers
  - Expected format: `Title,URL,Category,Tags,Description`
  - Tags should be pipe-separated: `tag1|tag2|tag3`
  - Auto-creates folders from categories
- **HTML**: Netscape Bookmark Format (browser export format)
  - Preserves folder hierarchy
  - Imports description, tags, icons, and metadata

#### Export Formats
- **JSON**: Complete data structure with all metadata
- **Markdown**: Organized with headers and list items
- **CSV**: Spreadsheet-compatible format
- **HTML**: Netscape format for browser import

### 🎨 UI/UX
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works on all screen sizes
- **Dark Mode**: Eye-friendly dark theme with subtle gradients
- **Floating Action Buttons**: Quick access to create, import/export
- **Visual Feedback**: Success/error messages with smooth animations

## Quick Start (Recommended)

Get up and running with a single command:

```bash
./setup_app.sh
```

This script will automatically:
1. Install all required dependencies (`npm install`)
2. Process initial bookmark data (if available)
3. Start the application
4. Open it in your default browser

*Note: You may need to make the script executable first:*
```bash
chmod +x setup_app.sh
```

## Manual Installation

If you prefer to set up manually:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The app will open at `http://localhost:5173`.

### 3. Build for Production
To create an optimized build:
```bash
npm run build
```

### 4. Preview Build
To test the production build locally:
```bash
npm run preview
```

## Usage

### Creating Bookmarks
1. Click the large blue floating button (bottom right)
2. Enter bookmark details (title, URL, description, tags)
3. Save - your bookmark is instantly stored

### Organizing with Folders
1. Click the green folder button to create a new folder
2. Drag and drop bookmarks (feature coming soon) or manually organize
3. Folders support unlimited nesting

### Import Bookmarks
1. Click the orange import/export button
2. Select "Import" tab
3. Click or drag a file (.json, .md, .csv, .html)
4. Bookmarks are automatically parsed and added

### Export Bookmarks
1. Click the orange import/export button
2. Select "Export" tab
3. Choose your preferred format
4. File is automatically downloaded

### Viewing Options
- **Grid Views**: Small, Medium, or Large cards with cover images
- **List View**: Compact list with quick actions
- **Carousel View**: Swipeable carousel presentation
- **Sort**: By name or date added

## Data Storage

All bookmark data is stored in your browser's localStorage under the key `bookmarks-data`. This means:
- ✅ Your data persists across browser sessions
- ✅ No server required - completely private
- ✅ Instant save/load
- ⚠️ Data is browser-specific (export to backup or transfer)
- ⚠️ Clearing browser data will delete bookmarks (export regularly!)

## File Structure

```
src/
├── components/         # React components
│   ├── BookmarkGrid.tsx
│   ├── BookmarkPreview.tsx
│   ├── BookmarkForm.tsx
│   ├── FolderForm.tsx
│   ├── ImportExportModal.tsx
│   ├── ListView.tsx
│   ├── CarouselView.tsx
│   ├── Sidebar.tsx
│   └── ViewControls.tsx
├── utils/             # Utility functions
│   ├── parser.ts      # Type definitions
│   ├── importParsers.ts  # Import format parsers
│   └── exportUtils.ts    # Export format generators
├── data/              # Initial data
│   └── bookmarks.json
├── App.tsx            # Main application
└── index.css          # Global styles
```

## Technologies

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **Framer Motion**: Smooth animations
- **Lucide React**: Beautiful icon library
- **LocalStorage**: Browser-based persistence

## Tips & Tricks

### Markdown Import Example
```markdown
# Work Resources
- [Google](https://google.com)
- [GitHub](https://github.com)

## Development
### Frontend
- [React Docs](https://react.dev)

### Backend
- [Node.js](https://nodejs.org)
```

This creates a nested structure:
- Work Resources (folder)
  - Google (bookmark)
  - GitHub (bookmark)
  - Development (folder)
    - Frontend (folder)
      - React Docs (bookmark)
    - Backend (folder)
      - Node.js (bookmark)

### CSV Import Example
```csv
Title,URL,Category,Tags,Description
Google,https://google.com,Search Engines,search|tools,Best search engine
GitHub,https://github.com,Development,code|git|tools,Code hosting platform
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Common Errors

**1. Permission Denied**
If you see `permission denied` when running the setup script:
```bash
chmod +x setup_app.sh
```

**2. Port 5173 Already in Use**
If the app fails to start because the port is busy, you can specific a different port:
```bash
npm run dev -- --port 3000
```
Or kill the process using the port:
```bash
npx kill-port 5173
```

**3. "Vite" not found**
Ensure all dependencies are installed correctly:
```bash
rm -rf node_modules
npm install
```

**4. Images not loading**
Run the image caching script manually:
```bash
node scripts/cache-images.js
```

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
