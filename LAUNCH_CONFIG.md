# Contentstack Launch Configuration

## Build Settings for Launch

### Required Settings:
- **Framework**: `Static Site` or `Other`
- **Build Command**: `npm run build` (or leave empty)
- **Output Directory**: `/` (root)
- **Node Version**: `22.x` or latest LTS

### Build Script Added
The `package.json` now includes a build script that Launch requires:
```json
"scripts": {
  "build": "echo 'Static site - no build required'"
}
```

This satisfies Launch's requirement for a build script.

## Sync Configuration

No `.env` file needed! The sync is configured directly in `contentstack-sync-browser.js` with your credentials:

```javascript
const CONTENTSTACK_CONFIG = {
  api_key: 'blt2c7743a722e0223b',
  delivery_token: 'csc495c21e306b40b500911f58',
  environment: 'production',
  region: 'us'
};
```

The sync will work automatically once deployed - it checks for updates every 10 seconds.

## After Deployment

1. Open your deployed site
2. Open browser console (F12)
3. You should see: `🔄 Auto-refresh enabled. Checking for changes every 10 seconds`
4. Make changes in Contentstack and publish
5. Changes appear automatically within 10 seconds!

