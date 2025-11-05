'use client';

import { useEffect, useState } from 'react';
import { useUser, useSession } from '@clerk/nextjs';
import { createClerkSupabaseClient, UserSettings } from '@/lib/supabase';
import { SubscriptionSettings } from '@/components/subscription-settings';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user } = useUser();
  const { session } = useSession();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !session) return;

    async function loadSettings() {
      setLoading(true);
      const supabase = createClerkSupabaseClient(() => session.getToken());

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single();

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

      setLoading(false);
    }

    loadSettings();
  }, [user, session]);

  const handleSave = async (apiMode: 'premium' | 'byok') => {
    if (!user || !session) return;

    const supabase = createClerkSupabaseClient(() => session.getToken());

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
