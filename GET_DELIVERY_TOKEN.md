# How to Get Your Contentstack Delivery Token

## Problem
The website is showing 401 errors because the `delivery_token` is invalid. The Delivery API requires a **Delivery Token** (different from Management Token).

## Solution: Get Your Delivery Token

### Step 1: Log into Contentstack
1. Go to https://app.contentstack.com/
2. Log in with your credentials

### Step 2: Navigate to Tokens
1. Click on your **Stack** (top left)
2. Go to **Settings** → **Tokens**
3. Or directly: **Settings** → **Stack** → **Tokens**

### Step 3: Find or Create Delivery Token
1. Look for **"Delivery Tokens"** section
2. You should see existing delivery tokens OR
3. Click **"+ Add Token"** or **"Create Token"**
4. Select **"Delivery Token"** type
5. Give it a name (e.g., "Website Delivery Token")
6. Select **"Production"** environment (or your target environment)
7. Click **"Create"** or **"Save"**

### Step 4: Copy the Token
1. The token will be displayed (usually starts with `cs` or `csc`)
2. **Copy the entire token** - it's long and contains letters and numbers
3. **Important**: Copy it immediately as it may not be shown again

### Step 5: Update Your Configuration
Once you have the delivery token, update `contentstack-sync-browser.js`:

```javascript
const CONTENTSTACK_CONFIG = {
  api_key: 'blt2c7743a722e0223b',
  delivery_token: 'YOUR_DELIVERY_TOKEN_HERE',  // ← Replace with your delivery token
  environment: 'production',
  region: 'us'
};
```

## Important Notes

### Management Token vs Delivery Token
- **Management Token** (`csc495c21e306b40b500911f58`): Used for creating/updating content via Management API
- **Delivery Token**: Used for reading content via Delivery API (what the website needs)

### Token Permissions
- Delivery tokens are **read-only** - they can only fetch content
- They are safe to use in frontend code (browser)
- Management tokens should **NEVER** be used in frontend code

### Environment Matching
- Make sure the delivery token is created for the **same environment** you're publishing to
- If you publish to "production", the token must have access to "production"
- Check the environment name matches exactly (case-sensitive)

## Quick Check

After updating the token, test it:

1. Open your website: http://localhost:8000
2. Open browser console (F12)
3. Run:
   ```javascript
   window.getHeroSection(true).then(hero => console.log('Hero:', hero));
   ```
4. If you see the hero data (not an error), the token is working!

## Troubleshooting

### Token Not Working?
1. **Verify token is for correct environment**
   - Check token settings in Contentstack
   - Ensure it has access to "production" environment

2. **Check token hasn't expired**
   - Some tokens have expiration dates
   - Create a new token if needed

3. **Verify API key is correct**
   - API key: `blt2c7743a722e0223b`
   - Should match your stack's API key

4. **Check environment name**
   - Must match exactly: "production" (case-sensitive)
   - Check in Contentstack what your environment is called

### Still Getting 401 Errors?
- Double-check you copied the **entire** token (no spaces, no line breaks)
- Make sure you're using a **Delivery Token**, not Management Token
- Verify the token has read permissions
- Check that content is published to the environment the token has access to

## Security Best Practices

1. **Never commit tokens to Git**
   - Consider using environment variables
   - Or use Contentstack Launch environment variables

2. **Use separate tokens for different environments**
   - Development token for dev
   - Production token for production

3. **Rotate tokens periodically**
   - For security, regenerate tokens regularly

