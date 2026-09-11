import { apiGet, apiPatch, apiPost } from './client';
import type { Poi, PoiCreateInput, PoiUpdateInput } from './types';

export const listPoi = () => apiGet<Poi[]>('/api/poi');

export const getPoi = (id: string) => apiGet<Poi>(`/api/poi/${id}`);

export const createPoi = (input: PoiCreateInput) => apiPost<Poi>('/api/poi', input);

export const updatePoi = (id: string, input: PoiUpdateInput) =>
  apiPatch<Poi>(`/api/poi/${id}`, input);
