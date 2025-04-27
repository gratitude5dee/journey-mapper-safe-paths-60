
import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import Vapi from '@vapi-ai/web';

const useVapi = () => {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const vapiRef = useRef<any>(null);

  const initializeVapi = useCallback(async () => {
    try {
      // Get configuration from Supabase edge function
      const { data: { VAPI_PUBLIC_KEY, VAPI_ASSISTANT_ID } } = await supabase.functions.invoke('get-vapi-config');
      
      if (!vapiRef.current && VAPI_PUBLIC_KEY && VAPI_ASSISTANT_ID) {
        const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
        vapiRef.current = { instance: vapiInstance, assistantId: VAPI_ASSISTANT_ID };

        vapiInstance.on('call-start', () => {
          setIsSessionActive(true);
        });

        vapiInstance.on('call-end', () => {
          setIsSessionActive(false);
          setConversation([]); // Reset conversation on call end
        });

        vapiInstance.on('volume-level', (volume: number) => {
          setVolumeLevel(volume);
        });

        vapiInstance.on('message', (message: any) => {
          if (message.type === 'transcript' && message.transcriptType === 'final') {
            setConversation((prev) => [
              ...prev,
              { role: message.role, text: message.transcript },
            ]);
          }
        });

        vapiInstance.on('error', (e: Error) => {
          console.error('Vapi error:', e);
        });

        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Failed to initialize Vapi:', error);
    }
  }, []);

  useEffect(() => {
    initializeVapi();

    return () => {
      if (vapiRef.current?.instance) {
        vapiRef.current.instance.stop();
        vapiRef.current = null;
      }
    };
  }, [initializeVapi]);

  const toggleCall = async () => {
    if (!vapiRef.current?.instance || !vapiRef.current?.assistantId) {
      console.warn('Vapi not initialized');
      return;
    }

    try {
      if (isSessionActive) {
        await vapiRef.current.instance.stop();
      } else {
        await vapiRef.current.instance.start(vapiRef.current.assistantId);
      }
    } catch (err) {
      console.error('Error toggling Vapi session:', err);
    }
  };

  return { volumeLevel, isSessionActive, conversation, toggleCall, isInitialized };
};

export default useVapi;
