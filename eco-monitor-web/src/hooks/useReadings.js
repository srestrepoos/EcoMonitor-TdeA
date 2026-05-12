import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function useReadings(limit = 60) {
  const [readings, setReadings]   = useState([]);
  const [current,  setCurrent]    = useState(null);
  const [connected, setConnected] = useState(false);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setConnected(false), 15000);
  };

  useEffect(() => {
    async function fetchInitial() {
      const { data, error } = await supabase
        .from('readings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (data && !error) {
        const sorted = [...data].reverse();
        setReadings(sorted);
        setCurrent(sorted[sorted.length - 1] ?? null);
      }
    }

    fetchInitial();

    const channel = supabase
      .channel('realtime-readings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'readings' },
        (payload) => {
          setCurrent(payload.new);
          setReadings(prev => [...prev.slice(-(limit - 1)), payload.new]);
          setConnected(true);
          resetTimeout();
        })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setConnected(true);
      });

    return () => {
      supabase.removeChannel(channel);
      clearTimeout(timeoutRef.current);
    };
  }, [limit]);

  return { readings, current, connected };
}
