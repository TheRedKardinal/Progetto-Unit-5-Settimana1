import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { fileToDataUrl } from '../utils/fileToDataUrl';
import { createDocumento, updateDocumento } from '../api/documents';
import type { Documento } from '../api/types';
import { ApiError } from '../api/client';
import './OcrSidebar.css';

export function OcrSidebar() {
  const [titolo, setTitolo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [testoModificato, setTestoModificato] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!titolo.trim() || !file) {
      setError('Titolo e file sono obbligatori');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      const contenuto = await fileToDataUrl(file);
      const created = await createDocumento({ titolo, contenuto });
      setDocumento(created);
      setTestoModificato(created.testo ?? '');
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
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Errore durante il salvataggio della correzione');
    } finally {
      setSaving(false);
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
          <label htmlFor="doc-file">Documento (immagine)</label>
          <input id="doc-file" type="file" accept="image/*" onChange={handleFileChange} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Scansione in corso...' : 'Carica e leggi con OCR'}
        </button>
      </form>

      {documento && (
        <form className="card" onSubmit={handleCorrection}>
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
    </div>
  );
}
