# Fix Hero Section Sync Issue

## Problem
Changes to hero_section entry (UID: `bltc322285692a26776`) are not reflecting on the website.

## Solution Steps

### Step 1: Verify Entry in Contentstack
1. Log into your Contentstack account
2. Navigate to `hero_section` content type
3. Find entry with UID: `bltc322285692a26776`
4. Verify:
   - ✅ Entry is **published** (not just saved)
   - ✅ Published to **production** environment
   - ✅ Title field has your changes
   - ✅ Check the "Published" timestamp

### Step 2: Clear Cache and Force Refresh

**Option A: Browser Console (Recommended)**

1. Open your website: http://localhost:8000
2. Open Browser Console: Press `F12`
3. Run these commands in order:

```javascript
// 1. Clear all cache
window.contentCache.clear();

// 2. Fetch hero section with cache bypass
const hero = await window.getHeroSection(true);

// 3. Verify the entry details
console.log('Entry UID:', hero?.uid);
console.log('Title:', hero?.title);
console.log('Updated:', hero?.updated_at);

// 4. Check if it matches your expected UID
if (hero?.uid === 'bltc322285692a26776') {
    console.log('✅ Correct entry found!');
} else {
    console.log('⚠️ Different entry found. Check Contentstack.');
}

// 5. Force re-render hero section
await window.renderHeroSection();

// OR: Force refresh everything
window.forceRefresh();
```

**Option B: Simple Page Reload**

1. Hard refresh the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. This will bypass browser cache and fetch fresh content

### Step 3: Verify the Fix

After running the commands, check:
- ✅ Hero title should show your updated text
- ✅ Browser console should show no errors
- ✅ Network tab should show successful API calls

## Common Issues & Solutions

### Issue 1: Entry Not Found
**Symptom**: Console shows `null` or `undefined` for hero entry

**Solutions**:
- Verify entry is published to **production** environment
- Check that entry UID matches: `bltc322285692a26776`
- Verify delivery_token has read permissions

### Issue 2: Wrong Entry Returned
**Symptom**: Different entry UID is returned

**Solutions**:
- The API fetches the first entry (limit: 1)
- Ensure your entry is the first/only published entry
- Or modify the query to fetch by UID (see below)

### Issue 3: Cached Content
**Symptom**: Old content still showing

**Solutions**:
```javascript
// Clear cache completely
window.contentCache.clear();

// Wait a moment
setTimeout(() => {
    window.forceRefresh();
}, 100);
```

### Issue 4: API Authentication Error
**Symptom**: 401 Unauthorized errors in console

**Solutions**:
- Verify `delivery_token` in `contentstack-sync-browser.js`
- Ensure token has read permissions for Delivery API
- Check that environment name matches exactly

## Advanced: Fetch Specific Entry by UID

If you need to fetch a specific entry by UID, you can modify the fetch function:

```javascript
// In browser console
async function getHeroByUid(uid) {
    const config = {
        api_key: 'blt2c7743a722e0223b',
        delivery_token: 'csc495c21e306b40b500911f58',
        environment: 'production'
    };
    
    const url = `https://cdn.contentstack.io/v3/content_types/hero_section/entries/${uid}?api_key=${config.api_key}&access_token=${config.delivery_token}&environment=${config.environment}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.entry;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Use it
const hero = await getHeroByUid('bltc322285692a26776');
console.log('Hero:', hero);
```

## Verification Checklist

- [ ] Entry is published in Contentstack
- [ ] Published to production environment
- [ ] Entry UID matches: `bltc322285692a26776`
- [ ] Cache cleared: `window.contentCache.clear()`
- [ ] Force refresh executed: `window.forceRefresh()`
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API response
- [ ] Website displays updated title

## Still Not Working?

1. **Check Contentstack directly**:
   - Verify the entry exists and is published
   - Check the exact field name (should be `title`)
   - Verify environment name matches

2. **Check API Response**:
   ```javascript
   // In browser console
   const hero = await window.getHeroSection(true);
   console.log('Full hero object:', JSON.stringify(hero, null, 2));
   ```

3. **Check Network Tab**:
   - Open DevTools → Network tab
   - Filter by "hero_section"
   - Check the API response
   - Verify the title field in the response

4. **Verify Configuration**:
   - Check `contentstack-sync-browser.js` line 9-14
   - Ensure `environment: 'production'` matches your Contentstack setup
   - Verify API credentials are correct

## Quick Fix Script

Copy and paste this entire block into your browser console:

```javascript
(async function() {
    console.log('🔄 Fixing hero section sync...');
    
    // Clear cache
    if (window.contentCache) {
        window.contentCache.clear();
        console.log('✅ Cache cleared');
    }
    
    // Fetch fresh hero
    const hero = await window.getHeroSection(true);
    console.log('📄 Hero entry:', hero);
    
    if (hero) {
        console.log('✅ Entry UID:', hero.uid);
        console.log('✅ Title:', hero.title);
        
        if (hero.uid === 'bltc322285692a26776') {
            console.log('✅ Correct entry found!');
        } else {
            console.log('⚠️ Different entry. Expected: bltc322285692a26776');
        }
        
        // Re-render
        await window.renderHeroSection();
        console.log('✅ Hero section re-rendered!');
    } else {
        console.log('❌ Hero entry not found');
    }
    
    console.log('✅ Done!');
})();
```

