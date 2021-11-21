import Layout from './Layout/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Providers from './Providers/Providers';
import NotFound from './NotFound/NotFound';
import Dashboard from './Dashboard/Dashboard';

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
