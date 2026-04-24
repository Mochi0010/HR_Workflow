import { useState, useEffect } from 'react';
import { getAutomations } from '../api/mockApi';

/**
 * Custom hook for fetching and caching mock automation actions
 */
export function useAutomations() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAutomations() {
      try {
        const data = await getAutomations();
        if (!cancelled) {
          setAutomations(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch automations:', err);
        if (!cancelled) setLoading(false);
      }
    }

    fetchAutomations();
    return () => { cancelled = true; };
  }, []);

  return { automations, loading };
}
