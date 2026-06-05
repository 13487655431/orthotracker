import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

// ============ Web 端图片压缩+转 base64 ============

function compressAndToBase64(uri: string, maxWidth: number): Promise<string> {
  // 如果已经是 data URI，直接返回
  if (uri.startsWith('data:')) return Promise.resolve(uri);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 计算缩放尺寸
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      // JPEG quality 0.7，保证文件小且质量可接受
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = uri;
  });
}

// ============ 照片复制 ============

export async function copyPhotoToCheckup(
  sourceUri: string,
  _checkupId: string
): Promise<{ id: string; uri: string; timestamp: string }> {
  // Web 端：压缩并转 base64，保证持久化
  if (Platform.OS === 'web') {
    const base64 = await compressAndToBase64(sourceUri, 800);
    return {
      id: uuidv4(),
      uri: base64,
      timestamp: new Date().toISOString(),
    };
  }

  // 原生端：复制到 app 文件目录
  const FileSystem = require('expo-file-system/legacy');
  const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;
  const dir = `${PHOTOS_DIR}${_checkupId}/`;

  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }

  const ext = sourceUri.split('.').pop()?.split('?')[0] || 'jpg';
  const filename = `${uuidv4()}.${ext}`;
  const destUri = `${dir}${filename}`;

  await FileSystem.copyAsync({ from: sourceUri, to: destUri });

  return {
    id: uuidv4(),
    uri: destUri,
    timestamp: new Date().toISOString(),
  };
}

// ============ 删除照片 ============

export async function deletePhoto(uri: string): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const FileSystem = require('expo-file-system/legacy');
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {}
}

// ============ 删除复查照片目录 ============

export async function deleteCheckupPhotos(_checkupId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const FileSystem = require('expo-file-system/legacy');
    const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;
    const dir = `${PHOTOS_DIR}${_checkupId}/`;
    await FileSystem.deleteAsync(dir, { idempotent: true });
  } catch {}
}

// ============ 获取照片信息 ============

export async function getPhotoInfo(uri: string) {
  if (Platform.OS === 'web') {
    return { exists: !!uri, isDirectory: false };
  }
  try {
    const FileSystem = require('expo-file-system/legacy');
    return await FileSystem.getInfoAsync(uri);
  } catch {
    return { exists: false, isDirectory: false };
  }
}
