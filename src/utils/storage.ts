import { Platform } from 'react-native';

const CHECKUPS_KEY = 'ortho_checkups';
const SETTINGS_KEY = 'ortho_settings';

export interface Photo {
  id: string;
  uri: string;
  timestamp: string;
}

export interface Checkup {
  id: string;
  date: string;
  notes: string;      // 复查备注
  photos: Photo[];
}

export interface Settings {
  startDate: string;
}

// ============ 跨平台存储 ============

const isWeb = Platform.OS === 'web';

async function getItem(key: string): Promise<string | null> {
  if (isWeb) return localStorage.getItem(key);
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return AsyncStorage.getItem(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) { localStorage.setItem(key, value); return; }
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return AsyncStorage.setItem(key, value);
}

// ============ 复查 CRUD ============

export async function getCheckups(): Promise<Checkup[]> {
  try {
    const json = await getItem(CHECKUPS_KEY);
    if (!json) return [];
    return JSON.parse(json);
  } catch (e) {
    console.error('getCheckups:', e);
    return [];
  }
}

export async function saveCheckups(checkups: Checkup[]): Promise<void> {
  try {
    await setItem(CHECKUPS_KEY, JSON.stringify(checkups));
  } catch (e) {
    console.error('saveCheckups:', e);
    throw e;
  }
}

export async function addCheckup(checkup: Checkup): Promise<void> {
  const checkups = await getCheckups();
  checkups.unshift(checkup);
  await saveCheckups(checkups);
}

export async function updateCheckup(updated: Checkup): Promise<void> {
  const checkups = await getCheckups();
  const idx = checkups.findIndex((c) => c.id === updated.id);
  if (idx !== -1) {
    checkups[idx] = updated;
    await saveCheckups(checkups);
  }
}

export async function deleteCheckup(id: string): Promise<void> {
  const checkups = await getCheckups();
  await saveCheckups(checkups.filter((c) => c.id !== id));
}

export async function getCheckupById(id: string): Promise<Checkup | undefined> {
  const checkups = await getCheckups();
  return checkups.find((c) => c.id === id);
}

// ============ 设置 ============

export async function getSettings(): Promise<Settings | null> {
  try {
    const json = await getItem(SETTINGS_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('getSettings:', e);
    return null;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('saveSettings:', e);
    throw e;
  }
}
