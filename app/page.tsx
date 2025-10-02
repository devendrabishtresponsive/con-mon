export default function Home() {
  return (
    <section style={{ padding: '2rem' }}>
      <h1>Welcome to the Google OAuth App</h1>
      <p>This is a minimal Next.js + TypeScript app that allows users to sign in using their Google account.</p>
      <ul>
        <li>🔐 Secure sign-in using Google OAuth 2.0</li>
        <li>🗂 Dashboard to view basic user info</li>
        <li>🔁 Logout to clear session</li>
      </ul>
      <p>Use the navigation links above to explore the app.</p>
    </section>
  );
}