import { useState } from 'react';
import type { FormEvent } from 'react';
import { PhotoCapture } from './PhotoCapture';
import { LocationPicker } from './LocationPicker';
import type { LocationValue } from './LocationPicker';
import { createFoto } from '../api/pics';
import { createPoi } from '../api/poi';
import { createPost } from '../api/posts';
import { ApiError } from '../api/client';
import './PostForm.css';

interface PostFormProps {
  onCreated?: () => void;
}

export function PostForm({ onCreated }: PostFormProps) {
  const [titolo, setTitolo] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationValue>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setTitolo('');
    setDescrizione('');
    setPhotos([]);
    setLocation({});
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!titolo.trim() || !descrizione.trim()) {
      setError('Titolo e descrizione sono obbligatori');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const idFoto =
        photos.length > 0
          ? await Promise.all(photos.map((contenuto) => createFoto(contenuto).then((f) => f.id)))
          : undefined;

      let idPoi: string | undefined;
      if (location.latitudine !== undefined && location.longitudine !== undefined) {
        const poi = await createPoi({
          indirizzo: location.indirizzo,
          latitudine: location.latitudine,
          longitudine: location.longitudine,
        });
        idPoi = poi.id;
      }

      await createPost({ titolo, descrizione, idFoto, idPoi });

      setSuccess(true);
      resetForm();
      onCreated?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Errore durante la creazione del post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-form">
      <h2>Crea un nuovo post</h2>
      <form className="card" onSubmit={handleSubmit}>
        {error && <p className="error-banner">{error}</p>}
        {success && <p className="success-banner">Post pubblicato con successo!</p>}

        <div className="field">
          <label htmlFor="titolo">Titolo</label>
          <input
            id="titolo"
            type="text"
            value={titolo}
            onChange={(event) => setTitolo(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="descrizione">Descrizione</label>
          <textarea
            id="descrizione"
            value={descrizione}
            onChange={(event) => setDescrizione(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Foto</label>
          <PhotoCapture photos={photos} onChange={setPhotos} />
        </div>

        <div className="field">
          <label>Posizione</label>
          <LocationPicker value={location} onChange={setLocation} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Pubblicazione...' : 'Pubblica post'}
        </button>
      </form>
    </div>
  );
}
