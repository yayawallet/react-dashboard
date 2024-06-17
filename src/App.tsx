import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './routing/AppRoutes';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
};

export default App;
