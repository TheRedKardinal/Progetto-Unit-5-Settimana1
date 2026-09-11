import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import '../utils/leafletIcons';
import type { Poi, Post } from '../api/types';

interface PostsMapProps {
  posts: Post[];
  poiById: Record<string, Poi>;
}

const containerStyle = { width: '100%', height: '360px', borderRadius: '10px' };

export function PostsMap({ posts, poiById }: PostsMapProps) {
  const markers = posts
    .filter((post) => post.idPoi && poiById[post.idPoi])
    .map((post) => {
      const poi = poiById[post.idPoi as string];
      return { post, poi, position: [poi.latitudine, poi.longitudine] as [number, number] };
    });

  if (markers.length === 0) {
    return <p className="muted">Nessun post con posizione da mostrare sulla mappa.</p>;
  }

  return (
    <MapContainer center={markers[0].position} zoom={5} style={containerStyle}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map(({ post, poi, position }) => (
        <Marker key={post.id} position={position}>
          <Popup>
            <strong>{post.titolo}</strong>
            {poi.indirizzo && <p className="muted">{poi.indirizzo}</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
