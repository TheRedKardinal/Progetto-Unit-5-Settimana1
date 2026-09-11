import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Foto } from './types';

export const listFoto = () => apiGet<Foto[]>('/api/pics');

export const getFoto = (id: string) => apiGet<Foto>(`/api/pics/${id}`);

/**
 * L'endpoint backend accetta una lista di contenuti (creazione in blocco),
 * ma qui esponiamo un'unica foto per chiamata come previsto dal flusso del form.
 */
export const createFoto = async (contenuto: string): Promise<Foto> => {
  const [foto] = await apiPost<Foto[]>('/api/pics', { contenuto: [contenuto] });
  return foto;
};

export const updateFoto = (id: string, contenuto: string) =>
  apiPatch<Foto>(`/api/pics/${id}`, { contenuto });

export const deleteFoto = (id: string) => apiDelete(`/api/pics/${id}`);
