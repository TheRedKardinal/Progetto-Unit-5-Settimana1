import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import { NavBar } from './components/NavBar';
import { ProfilePage } from './pages/ProfilePage';
import { FeedPage } from './pages/FeedPage';
import { OcrPage } from './pages/OcrPage';

function App() {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
      <BrowserRouter>
        <NavBar />
        <main className="container">
          <Routes>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/ocr" element={<OcrPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </LoadScript>
  );
}

export default App;
