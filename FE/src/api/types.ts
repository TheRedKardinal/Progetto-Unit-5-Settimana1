export interface Post {
  id: string;
  titolo: string;
  descrizione: string;
  createdAt: string;
  idPoi: string | null;
  idFoto: string[];
}

export interface PostCreateInput {
  titolo: string;
  descrizione: string;
  idFoto?: string[];
  idPoi?: string;
}

export interface PostUpdateInput {
  titolo?: string;
  descrizione?: string;
  idFoto?: string[];
  idPoi?: string;
}

export interface Foto {
  id: string;
  contenuto: string;
  createdAt: string;
  idPost: string | null;
}

export interface Poi {
  id: string;
  indirizzo: string | null;
  latitudine: number;
  longitudine: number;
}

export interface PoiCreateInput {
  indirizzo?: string;
  latitudine: number;
  longitudine: number;
}

export interface PoiUpdateInput {
  indirizzo?: string;
  latitudine?: number;
  longitudine?: number;
}

export interface Documento {
  id: string;
  titolo: string;
  testo: string | null;
  contenuto: string;
  createdAt: string;
}

export interface DocumentoCreateInput {
  titolo: string;
  contenuto: string;
}

export interface DocumentoUpdateInput {
  titolo?: string;
  testo?: string;
}
