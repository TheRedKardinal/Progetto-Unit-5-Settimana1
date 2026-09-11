import { useEffect, useState } from 'react';
import { deletePost, listPosts, updatePost } from '../api/posts';
import { listFoto } from '../api/pics';
import { listPoi } from '../api/poi';
import type { Foto, Poi, Post } from '../api/types';
import { PostCard } from './PostCard';
import { PostsMap } from './PostsMap';
import { ApiError } from '../api/client';
import './FeedColumn.css';

export function FeedColumn() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [fotoById, setFotoById] = useState<Record<string, Foto>>({});
  const [poiById, setPoiById] = useState<Record<string, Poi>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [postsData, fotoData, poiData] = await Promise.all([listPosts(), listFoto(), listPoi()]);
        if (cancelled) return;
        setPosts(postsData);
        setFotoById(Object.fromEntries(fotoData.map((f) => [f.id, f])));
        setPoiById(Object.fromEntries(poiData.map((p) => [p.id, p])));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Errore nel caricamento del feed');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Eliminare questo post? Verranno eliminate anche le foto e la posizione collegate.')) {
      return;
    }

    setDeletingId(id);
    setError(null);
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Errore durante l'eliminazione del post");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSavePost = async (id: string, changes: { titolo: string; descrizione: string }) => {
    const updated = await updatePost(id, changes);
    setPosts((prev) => prev.map((post) => (post.id === id ? updated : post)));
  };

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div>
      <h1>Feed</h1>
      {error && <p className="error-banner">{error}</p>}

      <section className="card feed-map-card">
        <h2>Mappa dei post</h2>
        <p className="muted">Mostra solo i post con posizione visibili nell'area di mappa corrente.</p>
        <PostsMap posts={posts} poiById={poiById} />
      </section>

      {loading ? (
        <p className="muted">Caricamento...</p>
      ) : sortedPosts.length === 0 ? (
        <p className="muted">Nessun post ancora pubblicato.</p>
      ) : (
        sortedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            fotoById={fotoById}
            poiById={poiById}
            onDelete={handleDeletePost}
            onSave={handleSavePost}
            deleting={deletingId === post.id}
          />
        ))
      )}
    </div>
  );
}
