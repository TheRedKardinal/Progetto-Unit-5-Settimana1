import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { DocumentCapture } from './DocumentCapture';
import { createDocumento, deleteDocumento, listDocumenti, updateDocumento } from '../api/documents';
import type { Documento } from '../api/types';
import { ApiError } from '../api/client';
import './OcrSidebar.css';

export function OcrSidebar() {
  const [titolo, setTitolo] = useState('');
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [testoModificato, setTestoModificato] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [documenti, setDocumenti] = useState<Documento[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingDocumento, setViewingDocumento] = useState<Documento | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDocumenti() {
      setLoadingList(true);
      try {
        const data = await listDocumenti();
        if (!cancelled) setDocumenti(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Errore nel caricamento dei documenti');
        }
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    }

    loadDocumenti();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!titolo.trim() || !documentImage) {
      setError('Titolo e immagine del documento sono obbligatori');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      const created = await createDocumento({ titolo, contenuto: documentImage });
      setDocumento(created);
      setTestoModificato(created.testo ?? '');
      setDocumenti((prev) => [created, ...prev]);
      setDocumentImage(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Errore durante la scansione OCR');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCorrection = async (event: FormEvent) => {
    event.preventDefault();
    if (!documento) return;

    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateDocumento(documento.id, { testo: testoModificato });
      setDocumento(updated);
      setSaved(true);
      setDocumenti((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Errore durante il salvataggio della correzione');
    } finally {
      setSaving(false);
    }
  };

  const handleViewDocumento = (doc: Documento) => {
    setViewingDocumento(doc);
    setDocumento(null);
    setError(null);
  };

  const handleStartEditFromView = () => {
    if (!viewingDocumento) return;
    setDocumento(viewingDocumento);
    setTestoModificato(viewingDocumento.testo ?? '');
    setSaved(false);
    setViewingDocumento(null);
  };

  const handleCloseView = () => {
    setViewingDocumento(null);
  };

  const handleDeleteDocumento = async (id: string) => {
    if (!window.confirm('Eliminare questo documento?')) return;

    setDeletingId(id);
    setError(null);
    try {
      await deleteDocumento(id);
      setDocumenti((prev) => prev.filter((d) => d.id !== id));
      if (documento?.id === id) {
        setDocumento(null);
        setTestoModificato('');
      }
      if (viewingDocumento?.id === id) {
        setViewingDocumento(null);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Errore durante l'eliminazione del documento");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h2>Scansione documento (OCR)</h2>

      {error && <p className="error-banner">{error}</p>}

      <form className="card ocr-upload-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="doc-titolo">Titolo</label>
          <input
            id="doc-titolo"
            type="text"
            value={titolo}
            onChange={(event) => setTitolo(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Documento (immagine)</label>
          <DocumentCapture value={documentImage} onChange={setDocumentImage} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Scansione in corso...' : 'Carica e leggi con OCR'}
        </button>
      </form>

      {viewingDocumento && (
        <div className="card ocr-upload-card">
          <h3>{viewingDocumento.titolo}</h3>
          <img className="ocr-document-preview-image" src={viewingDocumento.contenuto} alt={viewingDocumento.titolo} />
          <p className="muted">Testo estratto:</p>
          <p className="ocr-document-preview-text">
            {viewingDocumento.testo && viewingDocumento.testo.trim() !== '' ? viewingDocumento.testo : '(nessun testo estratto)'}
          </p>
          <div className="ocr-document-view-actions">
            <button type="button" className="btn btn-primary" onClick={handleStartEditFromView}>
              Modifica testo
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCloseView}>
              Chiudi
            </button>
          </div>
        </div>
      )}

      {documento && (
        <form className="card ocr-upload-card" onSubmit={handleCorrection}>
          <h3>Testo estratto</h3>
          <p className="muted">Puoi correggere manualmente il testo se l'OCR ha letto male qualcosa.</p>
          {saved && <p className="success-banner">Correzione salvata!</p>}
          <div className="field">
            <label htmlFor="doc-testo">Testo</label>
            <textarea
              id="doc-testo"
              value={testoModificato}
              onChange={(event) => setTestoModificato(event.target.value)}
              rows={8}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvataggio...' : 'Salva correzione'}
          </button>
        </form>
      )}

      <div className="card">
        <h3>I miei documenti</h3>
        {loadingList ? (
          <p className="muted">Caricamento...</p>
        ) : documenti.length === 0 ? (
          <p className="muted">Nessun documento caricato.</p>
        ) : (
          <ul className="ocr-document-list">
            {documenti.map((doc) => (
              <li key={doc.id} className="ocr-document-item">
                <button type="button" className="ocr-document-title" onClick={() => handleViewDocumento(doc)}>
                  {doc.titolo}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteDocumento(doc.id)}
                  disabled={deletingId === doc.id}
                >
                  {deletingId === doc.id ? '...' : 'Elimina'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
