# Sync Troubleshooting for Live Site

## ✅ Improvements Made

1. **Faster sync**: Changed from 10 seconds to 5 seconds
2. **Better change detection**: Now uses `publish_details.time` which is the most reliable indicator
3. **Force re-render**: Content re-renders every 15 seconds to catch any missed updates
4. **Better logging**: More detailed console messages

## 🔍 Debugging on Live Site

### Step 1: Open Browser Console
1. Open your deployed site
2. Press F12 or Cmd+Option+I
3. Go to Console tab

### Step 2: Check Sync Status
You should see these messages:

✅ **Good signs:**
```
🔄 Auto-refresh enabled. Checking for changes every 5 seconds
📡 Fetching hero_section from Contentstack...
✅ Successfully fetched hero_section: 1 entry/entries
💾 Stored initial content hash
🔍 Checking for content updates...
```

❌ **Problem signs:**
```
❌ Error fetching hero_section: ...
API Error Response: ...
⚠️ Could not fetch hero section for update check
```

### Step 3: Manual Test

In console, run:
```javascript
// Check current content
window.getHeroSection(true).then(hero => console.log(hero));

// Force check for updates
window.checkForUpdates();

// Force refresh all content
window.forceRefresh();
```

### Step 4: Verify Contentstack

1. Go to Contentstack CMS
2. Edit any content (e.g., hero section title)
3. **IMPORTANT**: Click **"Publish"** (not just Save!)
4. Select environment: **"production"**
5. Click **"Publish"**

### Step 5: Watch Console

After publishing, within 5-15 seconds you should see:
```
🔄 ✅ Content updated in Contentstack! Changes detected!
🔄 Clearing cache and refreshing page...
```

Then the page will reload automatically.

## 🛠️ Common Issues

### Issue: "API Error Response"
**Cause**: Delivery token might not have access
**Fix**: Verify token has read permissions for all content types

### Issue: Content shows but doesn't update
**Cause**: Page not reloading after update detected
**Fix**: Check console for "Changes detected" message. If seen but no reload, run `window.location.reload()`

### Issue: No console messages at all
**Cause**: Scripts not loading
**Fix**: Check Network tab - verify `contentstack-sync-browser.js` and `contentstack-render-browser.js` load successfully

### Issue: Changes in Contentstack but not on site
**Possible causes:**
1. Content not **published** (only saved)
2. Wrong environment selected (should be "production")
3. Cache issue

**Fix**:
1. Make sure to **Publish** (green button), not just Save
2. Select "production" environment
3. Clear browser cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## ✅ Quick Test

1. Open live site
2. Open console (F12)
3. Run: `window.checkForUpdates()`
4. Should see sync status
5. Edit content in Contentstack
6. **Publish** it
7. Wait 5-10 seconds
8. Should auto-refresh!

---

**Note**: Sync checks every 5 seconds and content re-renders every 15 seconds to ensure nothing is missed!

