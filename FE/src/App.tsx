import { LoadScript } from '@react-google-maps/api';
import { NavBar } from './components/NavBar';
import { PostForm } from './components/PostForm';
import { FeedColumn } from './components/FeedColumn';
import { OcrSidebar } from './components/OcrSidebar';
import './App.css';

function App() {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
      <NavBar />
      <main className="app-layout">
        <aside className="app-sidebar app-sidebar-left">
          <PostForm />
        </aside>
        <section className="app-main">
          <FeedColumn />
        </section>
        <aside className="app-sidebar app-sidebar-right">
          <OcrSidebar />
        </aside>
      </main>
    </LoadScript>
  );
}

export default App;
