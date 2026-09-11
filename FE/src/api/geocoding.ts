import { apiGet } from './client';

export interface GeocodeResult {
  indirizzo: string;
  latitudine: number;
  longitudine: number;
}

export const geocodeAddress = (indirizzo: string) =>
  apiGet<GeocodeResult>(`/api/geocoding?indirizzo=${encodeURIComponent(indirizzo)}`);
