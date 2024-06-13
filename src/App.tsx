import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RenderRoutes from './routing/RenderRoutes';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RenderRoutes />
    </QueryClientProvider>
  );
};

export default App;
