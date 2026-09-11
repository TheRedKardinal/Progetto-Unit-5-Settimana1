import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { fileToDataUrl } from '../utils/fileToDataUrl';
import './PhotoCapture.css';

interface PhotoCaptureProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export function PhotoCapture({ photos, onChange }: PhotoCaptureProps) {
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

  const handleFilesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const dataUrls = await Promise.all(Array.from(files).map(fileToDataUrl));
    onChange([...photos, ...dataUrls]);
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

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
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
    onChange([...photos, canvas.toDataURL('image/jpeg', 0.9)]);
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="photo-capture">
      <div className="photo-capture-actions">
        <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
          Carica immagini
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFilesSelected}
        />
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

      {photos.length > 0 && (
        <ul className="photo-thumbnails">
          {photos.map((photo, index) => (
            <li key={index}>
              <img src={photo} alt={`Anteprima ${index + 1}`} />
              <button
                type="button"
                className="thumbnail-remove"
                onClick={() => removePhoto(index)}
                aria-label="Rimuovi foto"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
