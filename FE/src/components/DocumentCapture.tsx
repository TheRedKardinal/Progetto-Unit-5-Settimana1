import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { fileToDataUrl } from '../utils/fileToDataUrl';
import './DocumentCapture.css';

interface DocumentCaptureProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function DocumentCapture({ value, onChange }: DocumentCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraOpen]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange(await fileToDataUrl(file));
    event.target.value = '';
  };

  const openCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      setCameraError('Impossibile accedere alla fotocamera: verifica i permessi del browser.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    onChange(canvas.toDataURL('image/jpeg', 0.9));
    closeCamera();
  };

  return (
    <div className="document-capture">
      <div className="document-capture-actions">
        <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
          Carica file
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileSelected} />
        {!cameraOpen ? (
          <button type="button" className="btn btn-secondary" onClick={openCamera}>
            Scatta una foto
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={closeCamera}>
            Chiudi fotocamera
          </button>
        )}
      </div>

      {cameraError && <p className="error-banner">{cameraError}</p>}

      {cameraOpen && (
        <div className="camera-preview">
          <video ref={videoRef} autoPlay playsInline muted />
          <button type="button" className="btn btn-primary" onClick={capturePhoto}>
            Scatta
          </button>
        </div>
      )}

      {value && !cameraOpen && (
        <div className="document-capture-preview">
          <img src={value} alt="Anteprima documento" />
          <button type="button" className="btn btn-secondary" onClick={() => onChange(null)}>
            Rimuovi
          </button>
        </div>
      )}
    </div>
  );
}
