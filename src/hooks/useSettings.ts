import { useState, useEffect, useCallback } from 'react';
import { getSettings, saveSettings, Settings } from '../utils/storage';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const s = await getSettings();
    setSettings(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback(async (newSettings: Settings) => {
    await saveSettings(newSettings);
    setSettings(newSettings);
  }, []);

  return { settings, loading, updateSettings, reload: loadSettings };
}
