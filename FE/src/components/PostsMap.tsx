import { useState } from 'react';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import type { Poi, Post } from '../api/types';

interface PostsMapProps {
  posts: Post[];
  poiById: Record<string, Poi>;
}

const containerStyle = { width: '100%', height: '360px', borderRadius: '10px' };

export function PostsMap({ posts, poiById }: PostsMapProps) {
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const markers = posts
    .filter((post) => post.idPoi && poiById[post.idPoi])
    .map((post) => {
      const poi = poiById[post.idPoi as string];
      return { post, poi, position: { lat: poi.latitudine, lng: poi.longitudine } };
    });

  if (markers.length === 0) {
    return <p className="muted">Nessun post con posizione da mostrare sulla mappa.</p>;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={markers[0].position} zoom={5}>
      {markers.map(({ post, poi, position }) => (
        <Marker key={post.id} position={position} onClick={() => setActivePostId(post.id)}>
          {activePostId === post.id && (
            <InfoWindow position={position} onCloseClick={() => setActivePostId(null)}>
              <div>
                <strong>{post.titolo}</strong>
                {poi.indirizzo && <p className="muted">{poi.indirizzo}</p>}
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
}
