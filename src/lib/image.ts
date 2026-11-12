// Ridimensiona e comprime una foto prima dell'invio (meno dati, caricamento rapido).
import { UserError } from './api';

const MAX_SIDE = 1600;
const MAX_BYTES = 3 * 1024 * 1024;

export async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new UserError('Seleziona una foto (file immagine).');
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new UserError('Formato immagine non supportato. Usa una foto JPEG o PNG.');
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new UserError('Impossibile elaborare la foto su questo dispositivo.');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const q of [0.8, 0.6, 0.4]) {
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', q));
    if (blob && blob.size <= MAX_BYTES) return blob;
  }
  throw new UserError('La foto è troppo grande. Prova a scattarla di nuovo.');
}
