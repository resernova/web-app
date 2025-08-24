'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
  const [message, setMessage] = useState('Testing Supabase connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('bookings').select('*').limit(1);
        
        if (error) {
          setMessage(`Error: ${error.message}`);
        } else {
          setMessage('✅ Successfully connected to Supabase!');
          console.log('Supabase data:', data);
        }
      } catch (error) {
        setMessage(`Error: ${error}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Supabase Connection Test</h2>
      <p className="text-gray-700">{message}</p>
    </div>
  );
}
