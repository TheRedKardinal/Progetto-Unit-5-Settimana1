import type { Foto, Poi, Post } from '../api/types';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  fotoById: Record<string, Foto>;
  poiById: Record<string, Poi>;
}

export function PostCard({ post, fotoById, poiById }: PostCardProps) {
  const poi = post.idPoi ? poiById[post.idPoi] : undefined;
  const foto = post.idFoto.map((id) => fotoById[id]).filter((f): f is Foto => Boolean(f));
  const data = new Date(post.createdAt).toLocaleString('it-IT');

  return (
    <article className="card post-card">
      <header className="post-card-header">
        <h3>{post.titolo}</h3>
        <span className="muted">{data}</span>
      </header>
      <p>{post.descrizione}</p>
      {poi && (
        <p className="muted post-card-location">
          📍 {poi.indirizzo ?? `${poi.latitudine.toFixed(5)}, ${poi.longitudine.toFixed(5)}`}
        </p>
      )}
      {foto.length > 0 && (
        <div className="post-card-photos">
          {foto.map((f) => (
            <img key={f.id} src={f.contenuto} alt="" />
          ))}
        </div>
      )}
    </article>
  );
}
