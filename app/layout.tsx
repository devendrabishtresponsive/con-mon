// import Header from './components/Header';
// import Footer from './components/Footer';

import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial' }}>
        <AuthProvider>
          <Header />
            <main>{children}</main>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}