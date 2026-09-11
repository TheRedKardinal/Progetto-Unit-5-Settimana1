import 'leaflet/dist/leaflet.css';
import { NavBar } from './components/NavBar';
import { PostForm } from './components/PostForm';
import { FeedColumn } from './components/FeedColumn';
import { OcrSidebar } from './components/OcrSidebar';
import './App.css';

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
