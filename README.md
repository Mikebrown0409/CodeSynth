# CodeSynth 

A modern web application for analyzing GitHub repositories and detecting lint issues with GitHub App integration.

## Features

- **GitHub OAuth Integration**: Seamless authentication with GitHub accounts
- **Repository Analysis**: Analyze any GitHub repository for code quality issues
- **File Tree Navigation**: Browse repository structure with intuitive navigation
- **Lint Issue Detection**: Comprehensive ESLint analysis with grouped results
- **Auto-Fix Preview**: See potential fixes for lint issues before applying
- **Commit Integration**: Future support for auto-committing fixes to repositories
- **Dark Theme**: Modern dark interface with shadcn/ui components
- **Real-time Updates**: Efficient caching based on repository commit SHA
- **Enhanced Workflow**: Direct repo analysis from landing page with OAuth flow

## Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Modern icon library
- **React Syntax Highlighter** - Code syntax highlighting
- **React Router** - Client-side routing

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT Authentication** - Secure token-based auth
- **GitHub API (Octokit)** - Repository and user data access
- **ESLint Integration** - Code analysis and auto-fixing
- **Express Sessions** - OAuth state management

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB instance
- GitHub App credentials (for OAuth)

### Installation

```bash
# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Edit .env with your configuration
```

### Environment Variables

```env
# Database
DATABASE_URL=mongodb://localhost:27017/codesynth

# JWT Secret
SECRET=your-secret-key-here

# GitHub Personal Access Token (fallback)
GITHUB_ACCESS_TOKEN=your-github-token-here

# GitHub App Configuration
GITHUB_CLIENT_ID=your-github-app-client-id
GITHUB_CLIENT_SECRET=your-github-app-client-secret

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:5173

# Session Secret (for OAuth state)
SESSION_SECRET=your-session-secret-here

# Environment
NODE_ENV=development
```

### GitHub App Setup

1. **Create a GitHub App** at https://github.com/settings/apps/new
2. **Configure the following settings**:
   - **Homepage URL**: `http://localhost:5173` (or your domain)
   - **Callback URL**: `http://localhost:5173/api/auth/github/callback`
   
3. **Set Permissions**:
   - **Repository permissions**:
     - Contents: Read & Write
     - Metadata: Read
     - Pull requests: Read & Write
     - Issues: Read
   - **Account permissions**:
     - Email addresses: Read

4. **Subscribe to Events** (future use):
   - installation
   - installation_repositories
   - push

5. **Copy your Client ID and Client Secret** to your `.env` file

### Development

```bash
# Start backend server
npm start

# Start frontend development server (in another terminal)
cd frontend && npm run dev
```

### Production Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Enhanced User Workflow

1. **Landing Page**: Users enter a GitHub repository URL
2. **OAuth Flow**: New users are redirected to GitHub for authentication
3. **Dashboard**: Users land in dashboard with their repository pre-analyzed
4. **Analysis View**: Three-panel layout showing:
   - Repository list and analyzer (left sidebar)
   - File tree and lint summary (middle panel)
   - File content with grouped lint issues (right panel)
5. **Auto-Fix Preview**: Click "Auto Fix" to see potential fixes
6. **Future**: One-click commit fixes back to user's repository

## Architecture

### Authentication Flow
- GitHub OAuth 2.0 with state verification
- JWT tokens for session management
- User GitHub access tokens stored securely
- Seamless integration with existing username/password system

### Repository Analysis
- Fetches entire file tree via GitHub Git API
- In-memory ESLint analysis (no repository cloning)
- Commit-based caching for performance
- Grouped lint results by rule for better UX

### Future Features
- **Auto-commit fixes**: Direct integration with user repositories
- **Pull request creation**: Automated PR generation for fixes
- **Webhook integration**: Real-time updates on repository changes
- **Team collaboration**: Shared repository analysis and fix management

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

## Deployment

The application is deployed on Heroku at: https://codesynth-b0400ce4d819.herokuapp.com/

For production deployment, ensure all environment variables are properly configured and the GitHub App callback URLs point to your production domain. 