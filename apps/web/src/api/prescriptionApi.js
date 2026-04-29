import imageCompression from 'browser-image-compression';

// Mock API. Replaced by axios calls + S3 presigned uploads in M2.

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'application/pdf'];

export async function compressImage(file) {
  if (file.type === 'application/pdf') return file;
  if (file.size <= 1024 * 1024) return file;
  return imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1800,
    useWebWorker: true,
    fileType: file.type,
  });
}

export function validateFile(file) {
  if (!ALLOWED.includes(file.type)) return 'Only JPG, PNG, or PDF accepted';
  if (file.size > MAX_BYTES) return 'File must be 10 MB or smaller';
  return null;
}

export function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadPrescription({ files, doctor, clinic, issueDate, patientName }) {
  if (!files?.length) throw new Error('Add at least one image or PDF');
  if (files.length > 5) throw new Error('Up to 5 files per prescription');

  // Compress + convert to data URLs in parallel
  const processed = await Promise.all(
    files.map(async (f) => {
      const compressed = await compressImage(f);
      const dataUrl = await readAsDataUrl(compressed);
      return {
        name: f.name,
        size: compressed.size,
        type: f.type,
        dataUrl,
      };
    })
  );

  // Simulate network upload
  await wait(900);

  return {
    id: `rx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    files: processed,
    doctor: doctor || null,
    clinic: clinic || null,
    issueDate: issueDate || null,
    patientName: patientName || 'Self',
    status: 'under_review',
    uploadedAt: new Date().toISOString(),
    rejectionReason: null,
  };
}
