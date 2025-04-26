
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Index } from './pages/Index';
import MapPage from './pages/MapPage';
import { Layout } from './components/Layout';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="map" element={<MapPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
