# 🔧 Fix: Invalid Delivery Token (401 Error)

## Problem
All API calls are failing with **401 Unauthorized** errors because the `delivery_token` is invalid.

**Error Message:**
```
"You're not allowed in here unless you're logged in."
"access_token is not valid"
```

## Root Cause
You're using a **Management Token** (`csc495c21e306b40b500911f58`) as the Delivery Token. These are **different tokens**:

- **Management Token**: Used for creating/updating content (Management API)
- **Delivery Token**: Used for reading content (Delivery API) ← **Website needs this**

## Solution: Get Your Delivery Token

### Step-by-Step Instructions

#### 1. Log into Contentstack
- Go to: https://app.contentstack.com/
- Log in with your credentials

#### 2. Navigate to Tokens
**Option A: Via Settings**
1. Click on your **Stack** name (top left)
2. Click **Settings** (gear icon)
3. Click **Stack**
4. Click **Tokens** in the left sidebar

**Option B: Direct URL**
- Go to: `https://app.contentstack.com/#/settings/tokens`

#### 3. Find or Create Delivery Token

**If Delivery Token Already Exists:**
1. Look in the **"Delivery Tokens"** section
2. Find a token that has access to **"production"** environment
3. Click on it to view details
4. **Copy the token** (it's a long string, usually starts with `cs` or `csc`)

**If No Delivery Token Exists:**
1. Click **"+ Add Token"** or **"Create Token"** button
2. Select **"Delivery Token"** as the token type
3. Fill in the form:
   - **Name**: "Website Delivery Token" (or any name)
   - **Description**: "Token for website to read content" (optional)
   - **Environment**: Select **"production"** (or your target environment)
4. Click **"Create"** or **"Save"**
5. **Copy the token immediately** (it may not be shown again!)

#### 4. Update Your Code

Open `contentstack-sync-browser.js` and update line 11:

**Current (WRONG - using Management Token):**
```javascript
delivery_token: 'csc495c21e306b40b500911f58', // This is a Management Token
```

**Replace with (CORRECT - using Delivery Token):**
```javascript
delivery_token: 'YOUR_DELIVERY_TOKEN_HERE', // Paste your Delivery Token here
```

**Example:**
```javascript
delivery_token: 'cs1234567890abcdef1234567890abcdef', // Your actual Delivery Token
```

#### 5. Save and Test

1. **Save** the file (`contentstack-sync-browser.js`)
2. **Hard refresh** your website: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. **Check browser console** - the 401 errors should be gone!

### Quick Test

After updating, test in browser console:

```javascript
// This should return data, not an error
const hero = await window.getHeroSection(true);
console.log('Hero:', hero);

// If you see the hero object with data, it's working! ✅
// If you still see 401 error, the token is still wrong
```

## Token Format

Delivery Tokens typically:
- Are **20-40 characters** long
- Start with `cs` or `csc`
- Contain letters and numbers
- Look like: `cs1234567890abcdef1234567890abcdef`

## Important Notes

### ✅ Do's
- Use **Delivery Token** for reading content (website)
- Use **Management Token** for creating/updating content (import scripts)
- Keep tokens secure
- Use different tokens for different environments if needed

### ❌ Don'ts
- **Never** use Management Token as Delivery Token
- **Never** commit tokens to Git (use environment variables in production)
- **Never** share tokens publicly

## Verification Checklist

After updating the token:

- [ ] Delivery Token copied from Contentstack
- [ ] Token pasted in `contentstack-sync-browser.js` line 11
- [ ] File saved
- [ ] Website refreshed (hard refresh)
- [ ] Browser console shows no 401 errors
- [ ] Content loads on the website
- [ ] Test command returns data: `await window.getHeroSection(true)`

## Still Getting 401 Errors?

### Check These:

1. **Token Type**
   - ✅ Using Delivery Token (not Management Token)
   - ✅ Token is for the correct environment ("production")

2. **Token Value**
   - ✅ Copied entire token (no spaces, no line breaks)
   - ✅ No extra characters before/after
   - ✅ Token hasn't expired

3. **Environment**
   - ✅ Environment name matches exactly: "production" (case-sensitive)
   - ✅ Content is published to this environment

4. **API Key**
   - ✅ API key is correct: `blt2c7743a722e0223b`
   - ✅ Matches your Contentstack stack

### Debug Commands

Run these in browser console to debug:

```javascript
// Check current config
console.log('API Key:', CONTENTSTACK_CONFIG.api_key);
console.log('Delivery Token:', CONTENTSTACK_CONFIG.delivery_token.substring(0, 10) + '...');
console.log('Environment:', CONTENTSTACK_CONFIG.environment);

// Test API call
const url = `https://cdn.contentstack.io/v3/content_types/hero_section/entries?api_key=${CONTENTSTACK_CONFIG.api_key}&access_token=${CONTENTSTACK_CONFIG.delivery_token}&environment=${CONTENTSTACK_CONFIG.environment}&limit=1`;
console.log('Testing URL:', url);
fetch(url).then(r => r.json()).then(d => console.log('Response:', d));
```

## Need More Help?

1. **Check Contentstack Documentation**: https://www.contentstack.com/docs/developers/apis/content-delivery-api/
2. **Verify Token in Contentstack**: Settings → Tokens → Delivery Tokens
3. **Contact Contentstack Support**: If token creation is not working

## Summary

**The Fix:**
1. Get Delivery Token from Contentstack (Settings → Tokens → Delivery Tokens)
2. Replace `delivery_token` in `contentstack-sync-browser.js` line 11
3. Save and refresh website
4. Test - errors should be gone! ✅

