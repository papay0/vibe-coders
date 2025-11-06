'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser, useSession } from '@clerk/nextjs';
import { createClerkSupabaseClient, UserSettings } from '@/lib/supabase';
import { SubscriptionSettings } from '@/components/subscription-settings';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user } = useUser();
  const { session } = useSession();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async (signal?: AbortSignal) => {
    if (!user || !session) return;

    setLoading(true);
    try {
      const supabase = createClerkSupabaseClient(() => session.getToken());

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single();

      // Check if request was aborted
      if (signal?.aborted) return;

      if (data) {
        setSettings(data);
      } else if (error && error.code === 'PGRST116') {
        // No settings found, create default
        const { data: newData } = await supabase
          .from('user_settings')
          .insert({
            clerk_user_id: user.id,
            api_mode: 'premium',
          })
          .select()
          .single();

        if (newData) {
          setSettings(newData);
        }
      }
    } catch (error) {
      if (signal?.aborted) return; // Ignore errors from aborted requests
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only depend on user.id - session is captured in closure and checked at runtime

  useEffect(() => {
    const abortController = new AbortController();
    loadSettings(abortController.signal);

    // Cleanup: abort the request if component unmounts or effect re-runs
    return () => {
      abortController.abort();
    };
  }, [loadSettings]);

  // Real-time subscription for settings changes
  useEffect(() => {
    if (!user?.id || !session) return;

    const supabase = createClerkSupabaseClient(() => session.getToken());

    const filter = `clerk_user_id=eq.${user.id}`;

    const channel = supabase
      .channel('user-settings-changes')
      .on('postgres_changes', {
        event: '*', // Listen to all events: INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'user_settings',
        filter, // Server-side filter
      }, (payload) => {
        // Handle different event types
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setSettings(payload.new as UserSettings);
        } else if (payload.eventType === 'DELETE') {
          setSettings(null);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, session]);

  const handleSave = async (apiMode: 'premium' | 'byok') => {
    if (!user || !session) return;

    const supabase = createClerkSupabaseClient(() => session!.getToken());

    const { error } = await supabase
      .from('user_settings')
      .update({ api_mode: apiMode })
      .eq('clerk_user_id', user.id);

    if (!error) {
      setSettings((prev) => prev ? { ...prev, api_mode: apiMode } : null);
      alert('Settings saved successfully!');
    } else {
      alert('Failed to save settings: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">Account Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and preferences
          </p>
        </div>

        <SubscriptionSettings
          settings={settings}
          loading={false}
          onSave={handleSave}
        />

        <div className="pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            Need to use your own API keys?{' '}
            <a
              href="https://github.com/your-org/vibe-coders-desktop/releases"
              className="text-teal-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download the Desktop App
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
