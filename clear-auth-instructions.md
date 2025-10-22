# Clear Authentication Data

## Quick Fix for "Failed to load your events" Error

The issue is that your browser has an expired or invalid JWT token stored. Here's how to fix it:

### Method 1: Browser Console (Recommended)
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Copy and paste this code:
```javascript
// Clear authentication data
localStorage.removeItem('authToken');
localStorage.removeItem('user');
console.log('✅ Authentication data cleared');
window.location.reload();
```
4. Press Enter to run it
5. The page will refresh and you'll be logged out
6. Log in again with:
   - Email: `shivasaiganeeb9@gmail.com`
   - Password: `password123`

### Method 2: Manual Clear
1. Open Developer Tools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Find Local Storage
4. Delete the `authToken` and `user` entries
5. Refresh the page

### Method 3: Incognito/Private Window
1. Open a new incognito/private window
2. Go to your app
3. Log in with the credentials above

## Why This Happens
- JWT tokens have expiration times
- The stored token might be from a different session
- The JWT secret might have changed

## After Clearing
Once you log in again, the Dashboard should show your registered events correctly!

