// Clear authentication data from localStorage
// Run this in the browser console to clear stored auth data

console.log('🧹 Clearing authentication data...');

// Clear all auth-related data
localStorage.removeItem('authToken');
localStorage.removeItem('user');

console.log('✅ Authentication data cleared');
console.log('🔄 Please refresh the page and log in again');

// Optional: Refresh the page automatically
// window.location.reload();
