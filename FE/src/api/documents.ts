import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Documento, DocumentoCreateInput, DocumentoUpdateInput } from './types';

export const listDocumenti = (titolo?: string) => {
  const query = titolo ? `?titolo=${encodeURIComponent(titolo)}` : '';
  return apiGet<Documento[]>(`/api/documents${query}`);
};

export const getDocumento = (id: string) => apiGet<Documento>(`/api/documents/${id}`);

export const createDocumento = (input: DocumentoCreateInput) =>
  apiPost<Documento>('/api/documents', input);

export const updateDocumento = (id: string, input: DocumentoUpdateInput) =>
  apiPatch<Documento>(`/api/documents/${id}`, input);

export const deleteDocumento = (id: string) => apiDelete(`/api/documents/${id}`);
