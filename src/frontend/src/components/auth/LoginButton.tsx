import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={disabled}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow-md ${
        isAuthenticated
          ? 'bg-secondary/80 hover:bg-secondary text-secondary-foreground'
          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loginStatus === 'logging-in' ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span>Logging in...</span>
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </>
      )}
    </button>
  );
}

