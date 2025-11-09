import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const SettingsContext = createContext({ settings: null, loading: true, updateLocal: () => {} });

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'settings', 'general');
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setSettings(snap.data());
      } else {
        setSettings({});
      }
      setLoading(false);
    }, (err) => {
      console.error('Settings listener error:', err);
      setSettings({});
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const updateLocal = (partial) => {
    setSettings(prev => ({ ...(prev || {}), ...partial }));
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateLocal }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;
