import { useState, useEffect } from 'react';
import { getAutomations } from '../api/mockApi';

export function useAutomations() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const data = await getAutomations();
        if (!cancelled) { setAutomations(data); setLoading(false); }
      } catch { if (!cancelled) setLoading(false); }
    }
    fetch();
    return () => { cancelled = true; };
  }, []);

  return { automations, loading };
}
