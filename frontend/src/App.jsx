import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const Placeholder = ({ name }) => (
  <div className="p-6 text-center text-gray-600">
    <h2 className="text-2xl font-semibold">{name}</h2>
    <p className="mt-2">Coming soon.</p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-full">
        <Navbar />
        <main className="max-w-3xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/bookmarks" element={<Placeholder name="Bookmarks" />} />
            <Route
              path="/stories/:id"
              element={<Placeholder name="Story Detail" />}
            />
            <Route path="*" element={<Placeholder name="404" />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
