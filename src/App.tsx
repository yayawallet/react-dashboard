import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthWrapper } from './auth/AuthWrapper';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthWrapper />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
