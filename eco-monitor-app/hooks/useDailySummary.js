import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useDailySummary(days = 30) {
  const [summaries, setSummaries] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('daily_summary')
        .select('*')
        .order('date', { ascending: false })
        .limit(days);

      if (data && !error) setSummaries([...data].reverse());
      setLoading(false);
    }
    load();
  }, [days]);

  return { summaries, loading };
}
