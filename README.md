# Gradient Generator

A React-based gradient generator tool that enables users to create, customize, and export linear gradients for web development with enhanced UI/UX features.

## Features

- Create and customize linear gradients
- Live preview of gradients
- Generate CSS and React Native code
- Save and load gradient presets
- Dark/Light theme toggle
- Responsive design

## Deploying to Vercel

### Option 1: Deploy directly from Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your [Vercel account](https://vercel.com/login)
3. Click on "Add New..." > "Project"
4. Select your repository
5. Configure the project with these settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Development Command**: `npm run dev`
6. Add any required environment variables (if needed)
7. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory and run:
   ```bash
   vercel
   ```

3. Follow the prompts to connect your account and configure your project

4. For subsequent deployments, run:
   ```bash
   vercel --prod
   ```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5000`