// utils/auth.ts

export const logout = async () => {
    try {
        await fetch('/api/auth/logout'); // Remove cookies on server
        localStorage.removeItem('cm_loggedInUser'); // Clear user info
        window.location.href = '/login'; // Redirect to login page
    } catch (err) {
        console.error('Logout failed:', err);
    }
};