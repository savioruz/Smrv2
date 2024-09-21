import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';
import { fetchData } from "@/lib/fetch.ts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";

interface HealthStatus {
  livez: boolean;
  readyz: boolean;
}

const HealthCheck: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus>({ livez: false, readyz: false });

  const checkEndpoint = async (endpoint: string): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.PUBLIC_API}${endpoint}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Health check failed for ${endpoint}:`, error);
      return false;
    }
  };

  const checkHealth = async () => {
    const livezStatus = await checkEndpoint('/livez');
    const readyzStatus = await checkEndpoint('/readyz');

    setHealth({
      livez: livezStatus,
      readyz: readyzStatus
    });
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 60*1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" size="icon">
          <Activity className={
            health.livez && health.readyz
              ? "text-green-500"
              : "text-red-500"
          }/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-fit">
        <div className="flex flex-col space-y-5 max-w-fit">
            <div className="flex items-center">
              {health.livez ? <CheckCircle2 className="mr-2 text-green-500"/> : <XCircle className="mr-2"/>}
              Server Status
            </div>
            <div className="flex items-center">
              {health.readyz ? <CheckCircle2 className="mr-2 text-green-500"/> : <XCircle className="mr-2"/>}
              Apps Status
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HealthCheck;
