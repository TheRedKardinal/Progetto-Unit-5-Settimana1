import { Link } from 'react-router-dom';
import { PostForm } from '../components/PostForm';
import './ProfilePage.css';

export function ProfilePage() {
  return (
    <div>
      <section className="card profile-header">
        <div className="profile-avatar" aria-hidden="true">
          🙂
        </div>
        <div>
          <h1>Il mio profilo</h1>
          <p className="muted">Benvenuto su Postbook</p>
        </div>
        <Link to="/ocr" className="btn btn-secondary profile-ocr-link">
          Scansiona un documento (OCR)
        </Link>
      </section>

      <PostForm />
    </div>
  );
}
