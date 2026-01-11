# Special Needs World 🌟

> *For Finn, and for people like him.* 💜

A Progressive Web Application (PWA) providing tools, activities, and resources for parents and individuals with special needs.

## 🎨 Features

### Current
- **Visual Schedule** - A visual scheduling tool using icons/pictures to help with daily routines
  - Pre-built schedule templates (School Day, Weekend, Morning Routine, Bedtime Routine)
  - Drag-and-drop schedule builder
  - 20+ activity icons
  - Progress tracking
  - Save schedules locally

### Coming Soon
- **Point to Talk** - Communication assistance tool
- **Tools** - Helpful everyday utilities
- **Health** - Health tracking and reminders
- **Games** - Fun educational games
- **Activities** - Creative activities and crafts
- **Knowledge Documents** - Resource library

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **PWA**: Vite PWA Plugin
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/special-needs-world.git

# Navigate to the project
cd special-needs-world

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
special-needs-world/
├── public/
│   └── favicon.svg
├── src/
│   ├── pages/
│   │   ├── EntryAuthScreen.jsx
│   │   ├── AppHub.jsx
│   │   └── VisualSchedule.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml
└── README.md
```

## 🎯 Design Philosophy

Special Needs World uses a kid-friendly "crayon" aesthetic:
- Warm, approachable colors
- Hand-drawn style borders and buttons
- Large, easily tappable touch targets
- Clear visual feedback
- Minimal text, maximum icons
- Accessible and screen-reader friendly

## 🔐 Authentication

Currently supports:
- Guest mode (for exploration, data stored locally only)
- Google OAuth (placeholder - to be implemented)
- Email/Password (placeholder - to be implemented)

## 📱 PWA Features

- Installable on mobile devices
- Works offline
- Fast loading
- Native app-like experience

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## 📄 License

MIT License - see LICENSE file for details.

## 💜 Dedication

This project is dedicated to Finn, and to all the wonderful individuals and families navigating the world of special needs. You inspire us every day.

---

Made with ❤️ for the special needs community
