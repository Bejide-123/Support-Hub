import { supabase } from '../lib/Supabase';

export interface UploadedFile {
  name: string;
  size: string;
  url: string;
  path: string;
  type: string;
}

export const uploadFile = async (
  file: File,
  ticketId: string,
  userId: string
): Promise<UploadedFile | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${ticketId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('ticket-attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('ticket-attachments')
      .getPublicUrl(filePath);

    return {
      name: file.name,
      size: formatFileSize(file.size),
      url: publicUrl,
      path: filePath,
      type: file.type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

export const uploadMultipleFiles = async (
  files: File[],
  ticketId: string,
  userId: string
): Promise<UploadedFile[]> => {
  const uploadPromises = files.map(file => uploadFile(file, ticketId, userId));
  const results = await Promise.all(uploadPromises);
  return results.filter((result): result is UploadedFile => result !== null);
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};