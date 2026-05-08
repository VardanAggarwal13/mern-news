import { Routes, Route } from 'react-router-dom';

const Placeholder = ({ name }) => (
  <div className="p-6 text-center text-gray-600">
    <h2 className="text-2xl font-semibold">{name}</h2>
    <p className="mt-2">Coming soon.</p>
  </div>
);

export default function App() {
  return (
    <div className="min-h-full">
      <header className="bg-brand text-white px-4 py-3 shadow">
        <h1 className="text-lg font-bold">HN Reader</h1>
      </header>
      <main className="max-w-3xl mx-auto py-6 px-4">
        <Routes>
          <Route path="/" element={<Placeholder name="Home" />} />
          <Route path="/login" element={<Placeholder name="Login" />} />
          <Route path="/register" element={<Placeholder name="Register" />} />
          <Route path="/bookmarks" element={<Placeholder name="Bookmarks" />} />
          <Route path="/stories/:id" element={<Placeholder name="Story Detail" />} />
          <Route path="*" element={<Placeholder name="404" />} />
        </Routes>
      </main>
    </div>
  );
}
