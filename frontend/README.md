# CodeSynth Frontend

A modern React application for analyzing GitHub repositories and detecting lint issues.

## Features

- **Repository Analysis**: Paste any GitHub repository URL to analyze code quality
- **File Tree Navigation**: Browse repository structure with intuitive navigation
- **Lint Issue Detection**: Comprehensive ESLint analysis with grouped results
- **Auto-Fix Preview**: See potential fixes for lint issues before applying
- **Dark Theme**: Modern dark interface with shadcn/ui components
- **Real-time Updates**: Efficient caching based on repository commit SHA

## Tech Stack

- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Modern icon library
- **React Syntax Highlighter** - Code syntax highlighting
- **React Router** - Client-side routing

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui base components
│   ├── Layout/       # Navigation and layout components
│   ├── FileTree/     # Repository file browser
│   ├── FileContent/  # Code viewer with lint results
│   ├── RepoAnalyzer/ # Repository URL input and analysis
│   ├── RepoList/     # Analyzed repositories sidebar
│   └── RepoLintSummary/ # Lint results overview
├── pages/
│   └── Dashboard/    # Main application interface
├── services/
│   └── gitService.js # GitHub API and lint service calls
└── lib/
    └── utils.js      # Utility functions for styling
```

## UI Components

The application uses a custom implementation of shadcn/ui components with:

- **Dark-only theme** for better code readability
- **Card-based layouts** for organized content sections
- **Badge components** for status indicators and counts
- **Button variants** for different actions and states
- **Input components** with proper focus and validation states

## Design System

All styling follows a consistent design system with:

- HSL-based color variables for theme consistency
- Consistent spacing and typography scales
- Accessible focus states and color contrasts
- Responsive design principles
- Modern glassmorphism effects with backdrop blur 