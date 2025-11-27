# Contentstack Content Sync Instructions

## Quick Sync Methods

### Method 1: Browser Console (Recommended)

1. **Open your website**: http://localhost:8000
2. **Open Browser Console**: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
3. **Run one of these commands**:

```javascript
// Force refresh all content (bypasses cache)
window.forceRefresh()

// Check for updates manually
window.checkForUpdates()

// Clear cache and reload
window.contentCache.clear()
window.location.reload()
```

### Method 2: Refresh Helper Page

1. **Open the refresh helper**: http://localhost:8000/refresh-content.html
2. **Click "Refresh All Content"** button
3. This will open the main website and attempt to refresh automatically

### Method 3: Manual Page Reload

Simply refresh the page (`F5` or `Cmd+R` / `Ctrl+R`). The website will automatically fetch the latest content from Contentstack.

## Understanding the Sync Process

### How It Works

1. **Content Fetching**: The website fetches content from Contentstack Delivery API
2. **Caching**: Content is cached for 5 seconds to improve performance
3. **Auto-Refresh**: Currently disabled, but manual refresh is available
4. **Force Refresh**: Bypasses cache and fetches fresh content immediately

### Content Types Synced

- Navigation Menu
- Hero Section
- Feature Cards
- Blog Posts
- CTA Section
- Footer Sections
- Company Logos

## Troubleshooting

### Content Not Updating?

1. **Check if content is published in Contentstack**
   - Content must be published to the `production` environment
   - Draft content won't appear on the website

2. **Clear cache and force refresh**:
   ```javascript
   window.contentCache.clear()
   window.forceRefresh()
   ```

3. **Check browser console for errors**:
   - Look for API errors (401, 403, 404)
   - Verify API credentials are correct

4. **Verify API credentials**:
   - Check `contentstack-sync-browser.js` for correct `api_key` and `delivery_token`
   - Ensure `environment` is set to `production`

### API Errors?

If you see authentication errors:
- Verify your Delivery Token is correct (different from Management Token)
- Check that the token has read permissions
- Ensure the environment name matches your Contentstack setup

## Advanced: Enable Auto-Refresh

To enable automatic content sync every 5 seconds:

1. Open `contentstack-sync-browser.js`
2. Change line 29:
   ```javascript
   const AUTO_REFRESH_ENABLED = true; // Change from false to true
   ```
3. Refresh the website

## Testing Content Sync

1. Make changes in Contentstack
2. Publish the changes to production
3. On your website, run: `window.forceRefresh()`
4. Changes should appear immediately

## Notes

- Content is cached for 5 seconds to reduce API calls
- Use `window.forceRefresh()` to bypass cache
- All content is fetched in parallel for better performance
- The website automatically re-renders content every 15 seconds

