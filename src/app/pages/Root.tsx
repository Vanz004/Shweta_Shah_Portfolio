import { Outlet } from 'react-router';
import { PortfolioProvider } from '../context/PortfolioContext';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Toaster } from 'sonner';

export default function Root() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <Outlet />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                letterSpacing: '0.04em',
              },
              duration: 2000,
            }}
          />
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
