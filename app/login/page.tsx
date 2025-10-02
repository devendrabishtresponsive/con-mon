// /app/login/page.tsx
'use client';

export default function Login() {
    // const handleLogin = async () => {
    //     try {
    //         const response = await fetch('/api/auth/login');
    //         if (response.ok) {
    //             window.location.href = '/api/auth/login';
    //         } else {
    //             const error = await response.json();
    //             if (error.demo) {
    //                 alert('Demo Mode: Google OAuth is not configured. This is just a visual preview of the app.');
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Login error:', error);
    //         alert('Demo Mode: Google OAuth is not configured. This is just a visual preview of the app.');
    //     }
    // }

    const handleLogin = () => {
        window.location.href = '/api/auth/login';
    };
    
    return (
        <main style={{ padding: '2rem' }}>
            <h1>Login</h1>
            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px' }}>
                <p><strong>Demo Mode:</strong> This app is running without Google OAuth configuration. You can explore the visual interface, but authentication won't work until environment variables are set up.</p>
            </div>
            <button
            onClick={handleLogin}
            style={{
                padding: '0.75rem 1.5rem',
                background: '#4285F4',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
            }}
            >Sign in with Google (Demo)</button>
        </main>
    );
}