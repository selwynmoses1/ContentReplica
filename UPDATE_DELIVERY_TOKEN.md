# Update Delivery Token - Quick Guide

## Current Issue
Your website is getting 401 errors because the delivery token is invalid.

**Current token in code**: `csc495c21e306b40b500911f58` (This is a Management Token, not a Delivery Token)

## What You Need
A **Delivery Token** from Contentstack (different from Management Token)

## Steps to Fix

### 1. Get Delivery Token from Contentstack

1. Log into Contentstack: https://app.contentstack.com/
2. Go to **Settings** → **Stack** → **Tokens**
3. Look for **"Delivery Tokens"** section
4. If you see existing tokens, copy one that has access to "production"
5. If no tokens exist, click **"+ Add Token"** → **"Delivery Token"**
   - Name: "Website Delivery Token"
   - Environment: Select "production"
   - Click "Create"
6. **Copy the token** (it's long, starts with `cs` or `csc`)

### 2. Update the Code

Open `contentstack-sync-browser.js` and update line 11:

**Find this:**
```javascript
delivery_token: 'csc495c21e306b40b500911f58',
```

**Replace with your Delivery Token:**
```javascript
delivery_token: 'YOUR_DELIVERY_TOKEN_HERE',
```

### 3. Save and Refresh

1. Save the file
2. Refresh your website (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console - errors should be gone!

## Quick Test

After updating, test in browser console:

```javascript
// This should return hero data, not an error
const hero = await window.getHeroSection(true);
console.log('Hero:', hero);
```

If you see the hero object with data, the token is working! ✅

## Need Help Finding the Token?

The delivery token is usually:
- 20-30 characters long
- Starts with `cs` or `csc`
- Found in: Contentstack → Settings → Stack → Tokens → Delivery Tokens
- Must have access to "production" environment

## Important

- **Management Token** = For creating/updating content (what you have)
- **Delivery Token** = For reading content (what the website needs)
- They are **different tokens** and cannot be used interchangeably

