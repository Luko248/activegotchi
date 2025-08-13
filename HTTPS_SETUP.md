# HTTPS Setup for iOS AR Development

## Problem
iOS Safari requires HTTPS to enable AR features. Model Viewer AR won't work on localhost (HTTP) on iPhone.

## Solutions

### Option 1: Use ngrok (Easiest)
```bash
# Install ngrok
npm install -g ngrok

# In one terminal, start your dev server
npm run dev

# In another terminal, create HTTPS tunnel
ngrok http 3000

# Use the HTTPS URL on your iPhone
# Example: https://abc123.ngrok.io
```

### Option 2: Local HTTPS with mkcert
```bash
# Install mkcert
brew install mkcert
mkcert -install

# Create certificates for localhost
mkcert localhost 127.0.0.1 ::1

# Update vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    https: {
      key: fs.readFileSync('./localhost+2-key.pem'),
      cert: fs.readFileSync('./localhost+2.pem'),
    }
  }
})

# Access via https://localhost:3000
```

### Option 3: Deploy to Vercel/Netlify
```bash
# Build and deploy
npm run build

# Deploy to Vercel
npx vercel --prod

# Or deploy to Netlify
npx netlify deploy --prod --dir=dist
```

### Option 4: Use Your Local IP with HTTPS
```bash
# Find your local IP
ipconfig getifaddr en0

# Create certificate for your IP
mkcert 192.168.1.xxx

# Update vite config with your IP
# Access via https://192.168.1.xxx:3000
```

## Quick Test
1. Look for the red "AR Debug Test" box in bottom-left
2. Check if it shows HTTPS protocol
3. Try the small test model viewer in the debug box
4. If it has an AR button, your setup works!

## iOS AR Requirements
- iOS 12+ with A9+ processor (iPhone 6s+)
- Safari or Chrome browser
- HTTPS connection (required!)
- Camera permission (granted automatically)

## Verification Steps
1. Open AR Debug Test (red box in app)
2. Check Protocol shows "https:"
3. Test model should show AR button
4. Tap AR button → Should ask for camera permission
5. Camera opens → AR works!