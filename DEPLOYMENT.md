# Deployment Guide - Angular Column Filter Demo App

This guide explains how to deploy the Angular demo application to various hosting platforms.

## Option 1: GitHub Pages (Recommended - Already Configured) ✅

### Setup Steps:

1. **Enable GitHub Pages in Repository Settings:**
   - Go to your GitHub repository: `https://github.com/kakarotx10/ngx-column-filter`
   - Navigate to: **Settings** → **Pages**
   - Under **Source**, select: **GitHub Actions**
   - Click **Save**

2. **Push Code to Main Branch:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Automatic Deployment:**
   - GitHub Actions will automatically build and deploy your app
   - Check the **Actions** tab in your repository to see deployment progress
   - Once complete, your app will be live at:
   - `https://kakarotx10.github.io/ngx-column-filter/`

### Manual Deployment (if needed):

```bash
npm run build:gh-pages
# Then manually upload dist/column-filter-library/browser to gh-pages branch
```

---

## Option 2: Vercel (Easiest & Fastest) ⚡

### Quick Deploy:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts. It will detect Angular automatically.

### Via Vercel Dashboard:

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **New Project**
4. Import your repository: `kakarotx10/ngx-column-filter`
5. Vercel will auto-detect Angular
6. Click **Deploy**

**Build Settings (Auto-detected):**
- Framework Preset: Angular
- Build Command: `npm run build`
- Output Directory: `dist/column-filter-library/browser`

Your app will be live at: `https://ngx-column-filter.vercel.app` (or custom domain)

---

## Option 3: Netlify 🚀

### Quick Deploy:

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build & Deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist/column-filter-library/browser
   ```

### Via Netlify Dashboard:

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click **Add new site** → **Import an existing project**
4. Select your repository: `kakarotx10/ngx-column-filter`
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/column-filter-library/browser`
6. Click **Deploy site**

Your app will be live at: `https://random-name.netlify.app` (or custom domain)

### Create `netlify.toml` (Optional - for auto-config):

Create `netlify.toml` in root:
```toml
[build]
  command = "npm run build"
  publish = "dist/column-filter-library/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Option 4: Firebase Hosting 🔥

### Setup:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase:**
   ```bash
   firebase init hosting
   ```
   - Select existing or create new Firebase project
   - Public directory: `dist/column-filter-library/browser`
   - Configure as single-page app: **Yes**
   - Set up automatic builds: **No** (or Yes if you want)

4. **Deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

Your app will be live at: `https://your-project-id.web.app`

---

## Option 5: Cloudflare Pages ☁️

### Via Dashboard:

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign up/Login
3. Click **Create a project** → **Connect to Git**
4. Select your repository: `kakarotx10/ngx-column-filter`
5. Configure:
   - **Framework preset:** Angular
   - **Build command:** `npm run build`
   - **Build output directory:** `dist/column-filter-library/browser`
6. Click **Save and Deploy**

Your app will be live at: `https://your-project.pages.dev`

---

## Local Testing Before Deploy:

```bash
# Build for production
npm run build

# Test the build locally
npx http-server -p 8080 -c-1 dist/column-filter-library/browser

# Or use Angular CLI
ng serve --configuration production
```

---

## Environment-Specific Builds:

### GitHub Pages (with base-href):
```bash
npm run build:gh-pages
```

### Standard Production:
```bash
npm run build
```

### Custom Base Path:
```bash
ng build --configuration production --base-href=/custom-path/
```

---

## Troubleshooting:

### Issue: 404 errors on refresh (Single Page App routing)
**Solution:** Configure your hosting provider to redirect all routes to `index.html`

- **Vercel:** Auto-handled (creates `vercel.json` automatically)
- **Netlify:** Create `netlify.toml` with redirects (see above)
- **Firebase:** Auto-handled if you selected "single-page app"
- **GitHub Pages:** Already configured in workflow
- **Cloudflare:** Auto-handled for Angular

### Issue: Assets not loading
**Solution:** Check `base-href` in build command matches your deployment path

---

## Recommended: GitHub Pages + Vercel

- **GitHub Pages:** For stable releases (linked to repo)
- **Vercel:** For preview deployments (automatic on every PR)

Both can be configured simultaneously!

---

## Quick Deploy Commands Summary:

```bash
# GitHub Pages (via workflow - automatic)
git push origin main

# Vercel
vercel

# Netlify
netlify deploy --prod

# Firebase
firebase deploy
```

---

**Need Help?** Check the hosting provider's documentation or open an issue in the repository.
