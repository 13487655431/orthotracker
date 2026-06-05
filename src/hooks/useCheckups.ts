import { useState, useEffect, useCallback } from 'react';
import {
  getCheckups,
  addCheckup,
  updateCheckup,
  deleteCheckup,
  getCheckupById,
  Checkup,
  Photo,
} from '../utils/storage';
import { copyPhotoToCheckup, deletePhoto, deleteCheckupPhotos } from '../utils/photoManager';

export function useCheckups() {
  const [checkups, setCheckups] = useState<Checkup[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getCheckups();
    setCheckups(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (checkup: Checkup) => {
    await addCheckup(checkup);
    setCheckups((prev) => [checkup, ...prev]);
  }, []);

  const update = useCallback(async (updated: Checkup) => {
    await updateCheckup(updated);
    setCheckups((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteCheckup(id);
    await deleteCheckupPhotos(id);
    setCheckups((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addPhoto = useCallback(async (checkupId: string, sourceUri: string): Promise<Photo | null> => {
    try {
      const photo = await copyPhotoToCheckup(sourceUri, checkupId);
      const updated = await getCheckupById(checkupId);
      if (updated) {
        updated.photos.push(photo);
        await updateCheckup(updated);
        setCheckups((prev) =>
          prev.map((c) => (c.id === checkupId ? updated : c))
        );
        return photo;
      }
      return null;
    } catch (e) {
      console.error('addPhoto error:', e);
      return null;
    }
  }, []);

  const removePhoto = useCallback(async (checkupId: string, photoId: string, uri: string) => {
    await deletePhoto(uri);
    const checkup = await getCheckupById(checkupId);
    if (checkup) {
      checkup.photos = checkup.photos.filter((p) => p.id !== photoId);
      await updateCheckup(checkup);
      setCheckups((prev) =>
        prev.map((c) => (c.id === checkupId ? checkup : c))
      );
    }
  }, []);

  return { checkups, loading, add, update, remove, addPhoto, removePhoto, reload: load };
}
