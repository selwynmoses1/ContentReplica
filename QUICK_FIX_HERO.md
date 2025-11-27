# Quick Fix: Hero Section Not Updating

## Immediate Solution

Open your website at **http://localhost:8000** and run this in the browser console:

```javascript
// Step 1: Clear cache
window.contentCache.clear();

// Step 2: Fetch your specific entry by UID
const hero = await window.getHeroSection(true, 'bltc322285692a26776');

// Step 3: Verify it's the correct entry
console.log('Entry UID:', hero?.uid);
console.log('Title:', hero?.title);

// Step 4: Re-render with the specific entry
await window.renderHeroSection('bltc322285692a26776');

// OR: Force refresh everything
window.forceRefresh();
```

## One-Line Fix

```javascript
window.contentCache.clear(); await window.renderHeroSection('bltc322285692a26776');
```

## Why This Works

The code has been updated to:
1. Accept an optional `entryUid` parameter
2. Fetch the specific entry by UID if provided
3. Otherwise, fetch the first entry (default behavior)

## Verify It Worked

After running the commands:
1. Check the hero title on the page - it should show your updated text
2. Check browser console - should show the correct UID and title
3. The entry UID should be: `bltc322285692a26776`

## If Still Not Working

1. **Verify in Contentstack**:
   - Entry is published (not just saved)
   - Published to **production** environment
   - Title field has your changes

2. **Check API Response**:
   ```javascript
   const hero = await window.getHeroSection(true, 'bltc322285692a26776');
   console.log('Full response:', JSON.stringify(hero, null, 2));
   ```

3. **Hard Refresh**:
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - This bypasses all browser cache

