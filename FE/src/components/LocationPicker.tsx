import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import '../utils/leafletIcons';
import { geocodeAddress } from '../api/geocoding';
import { ApiError } from '../api/client';
import './LocationPicker.css';

export interface LocationValue {
  indirizzo?: string;
  latitudine?: number;
  longitudine?: number;
}

interface LocationPickerProps {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}

const containerStyle = { width: '100%', height: '220px', borderRadius: '10px' };
const defaultCenter: [number, number] = [41.9028, 12.4964];

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function RecenterOnChange({ lat, lng }: { lat: number | undefined; lng: number | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      map.setView([lat, lng], map.getZoom() < 12 ? 14 : map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [addressInput, setAddressInput] = useState(value.indirizzo ?? '');
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const position: [number, number] | null =
    value.latitudine !== undefined && value.longitudine !== undefined
      ? [value.latitudine, value.longitudine]
      : null;

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddressInput(event.target.value);
  };

  const handleMapSelect = (lat: number, lng: number) => {
    onChange({
      indirizzo: value.indirizzo,
      latitudine: lat,
      longitudine: lng,
    });
  };

  const handleGeocode = async () => {
    if (!addressInput.trim()) return;
    setGeocoding(true);
    setGeocodeError(null);
    try {
      const result = await geocodeAddress(addressInput);
      onChange({
        indirizzo: result.indirizzo,
        latitudine: result.latitudine,
        longitudine: result.longitudine,
      });
      setAddressInput(result.indirizzo);
    } catch (err) {
      console.error('Geocoding fallito:', err);
      setGeocodeError(err instanceof ApiError ? err.message : "Errore durante la geocodifica dell'indirizzo");
    } finally {
      setGeocoding(false);
    }
  };

  const handleClear = () => {
    onChange({});
    setAddressInput('');
    setGeocodeError(null);
  };

  return (
    <div className="location-picker">
      <div className="address-row">
        <input
          type="text"
          value={addressInput}
          onChange={handleAddressChange}
          placeholder="Es. Piazza Duomo, Milano"
        />
        <button type="button" className="btn btn-secondary" onClick={handleGeocode} disabled={geocoding}>
          {geocoding ? 'Ricerca...' : 'Cerca indirizzo'}
        </button>
      </div>
      {geocodeError && <p className="error-banner">{geocodeError}</p>}

      <p className="muted">Oppure clicca un punto sulla mappa per selezionare la posizione.</p>

      <MapContainer center={position ?? defaultCenter} zoom={position ? 14 : 5} style={containerStyle}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onSelect={handleMapSelect} />
        <RecenterOnChange lat={value.latitudine} lng={value.longitudine} />
        {position && <Marker position={position} />}
      </MapContainer>

      {position && (
        <div className="location-summary">
          <span className="muted">
            Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
          </span>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            Rimuovi posizione
          </button>
        </div>
      )}
    </div>
  );
}
