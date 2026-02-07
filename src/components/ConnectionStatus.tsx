import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Wifi, WifiOff } from 'lucide-react';

export const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Just check if we can query anything, even with 0 results
        const { error } = await supabase.from('app_settings').select('id').limit(1);
        
        // If error is "PGRST116" (no rows) it means connection IS successful but table is empty.
        // We consider this CONNECTED.
        if (error && error.code !== 'PGRST116') throw error;
        
        setIsConnected(true);
      } catch (e) {
        console.error('Connection Check Failed:', e);
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) return null;

  return (
    <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
      isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}>
      {isConnected ? (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Cloud Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span className="font-medium">Disconnected</span>
        </>
      )}
    </div>
  );
};