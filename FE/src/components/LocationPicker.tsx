import { useCallback, useState } from 'react';
import type { ChangeEvent } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
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

const containerStyle = { width: '100%', height: '320px', borderRadius: '10px' };
const defaultCenter = { lat: 41.9028, lng: 12.4964 };

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [addressInput, setAddressInput] = useState(value.indirizzo ?? '');
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const position =
    value.latitudine !== undefined && value.longitudine !== undefined
      ? { lat: value.latitudine, lng: value.longitudine }
      : null;

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      onChange({
        indirizzo: value.indirizzo,
        latitudine: event.latLng.lat(),
        longitudine: event.latLng.lng(),
      });
    },
    [onChange, value.indirizzo],
  );

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddressInput(event.target.value);
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

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position ?? defaultCenter}
        zoom={position ? 14 : 5}
        onClick={handleMapClick}
      >
        {position && <Marker position={position} />}
      </GoogleMap>

      {position && (
        <div className="location-summary">
          <span className="muted">
            Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
          </span>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            Rimuovi posizione
          </button>
        </div>
      )}
    </div>
  );
}
