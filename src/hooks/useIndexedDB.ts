'use client';

import { useCallback } from 'react';
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'photobooth-db';
const DB_VERSION = 1;

export function useIndexedDB() {
  const getDB = useCallback(async (): Promise<IDBPDatabase> => {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('gallery')) {
          const store = db.createObjectStore('gallery', { keyPath: 'id' });
          store.createIndex('date', 'createdAt');
          store.createIndex('event', 'eventId');
        }
        if (!db.objectStoreNames.contains('transactions')) {
          db.createObjectStore('transactions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
  }, []);

  const save = useCallback(async <T>(storeName: string, data: T & { id: string }) => {
    const db = await getDB();
    await db.put(storeName, data);
  }, [getDB]);

  const getAll = useCallback(async <T>(storeName: string): Promise<T[]> => {
    const db = await getDB();
    return db.getAll(storeName);
  }, [getDB]);

  const get = useCallback(async <T>(storeName: string, id: string): Promise<T | undefined> => {
    const db = await getDB();
    return db.get(storeName, id);
  }, [getDB]);

  const remove = useCallback(async (storeName: string, id: string) => {
    const db = await getDB();
    await db.delete(storeName, id);
  }, [getDB]);

  return { save, getAll, get, remove };
}
