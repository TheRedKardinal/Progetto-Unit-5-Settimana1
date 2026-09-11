import { useState } from 'react';
import type { Foto, Poi, Post } from '../api/types';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  fotoById: Record<string, Foto>;
  poiById: Record<string, Poi>;
  onDelete: (id: string) => void;
  onSave: (id: string, changes: { titolo: string; descrizione: string }) => Promise<void>;
  deleting: boolean;
}

export function PostCard({ post, fotoById, poiById, onDelete, onSave, deleting }: PostCardProps) {
  const poi = post.idPoi ? poiById[post.idPoi] : undefined;
  const foto = post.idFoto.map((id) => fotoById[id]).filter((f): f is Foto => Boolean(f));
  const data = new Date(post.createdAt).toLocaleString('it-IT');

  const [isEditing, setIsEditing] = useState(false);
  const [editTitolo, setEditTitolo] = useState(post.titolo);
  const [editDescrizione, setEditDescrizione] = useState(post.descrizione);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setEditTitolo(post.titolo);
    setEditDescrizione(post.descrizione);
    setError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!editTitolo.trim() || !editDescrizione.trim()) {
      setError('Titolo e descrizione sono obbligatori');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(post.id, { titolo: editTitolo, descrizione: editDescrizione });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante l'aggiornamento del post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="card post-card">
      <button
        type="button"
        className="post-card-delete"
        onClick={() => onDelete(post.id)}
        disabled={deleting}
        aria-label="Elimina post"
        title="Elimina post"
      >
        ×
      </button>

      <h3 className="post-card-title">{post.titolo}</h3>
      {poi && (
        <p className="post-card-address">
          📍 {poi.indirizzo ?? `${poi.latitudine.toFixed(5)}, ${poi.longitudine.toFixed(5)}`}
        </p>
      )}

      {isEditing ? (
        <div className="post-card-edit-form">
          {error && <p className="error-banner">{error}</p>}
          <div className="field">
            <label htmlFor={`edit-titolo-${post.id}`}>Titolo</label>
            <input
              id={`edit-titolo-${post.id}`}
              type="text"
              value={editTitolo}
              onChange={(event) => setEditTitolo(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor={`edit-descrizione-${post.id}`}>Descrizione</label>
            <textarea
              id={`edit-descrizione-${post.id}`}
              value={editDescrizione}
              onChange={(event) => setEditDescrizione(event.target.value)}
            />
          </div>
          <div className="post-card-edit-actions">
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvataggio...' : 'Salva'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancelEditing} disabled={saving}>
              Annulla
            </button>
          </div>
        </div>
      ) : (
        <p className="post-card-content">{post.descrizione}</p>
      )}

      {foto.length > 0 && (
        <div className="post-card-photos">
          {foto.map((f) => (
            <img key={f.id} src={f.contenuto} alt="" />
          ))}
        </div>
      )}

      <footer className="post-card-footer">
        <span className="muted">{data}</span>
        {!isEditing && (
          <button type="button" className="btn btn-secondary" onClick={startEditing}>
            Modifica
          </button>
        )}
      </footer>
    </article>
  );
}
