'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { UserSettings } from '@/lib/supabase';

interface SubscriptionSettingsProps {
  settings: UserSettings | null;
  loading: boolean;
  onSave: (apiMode: 'premium' | 'byok') => Promise<void>;
}

export function SubscriptionSettings({ settings, loading, onSave }: SubscriptionSettingsProps) {
  const [apiMode, setApiMode] = useState<'premium' | 'byok'>(settings?.api_mode || 'premium');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(apiMode);
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          Choose how you want to use Appily
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
          </div>
        ) : (
          <>
            <RadioGroup value={apiMode} onValueChange={(v) => setApiMode(v as any)}>
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Premium Subscription</div>
                  <div className="text-sm text-muted-foreground">
                    Unlimited usage with our managed API
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="byok" id="byok" />
                <Label htmlFor="byok" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Bring Your Own Key (BYOK)</div>
                  <div className="text-sm text-muted-foreground">
                    Use your own API key (Anthropic, OpenAI, etc.)
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {apiMode === 'byok' && (
              <div className="rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/50 p-4">
                <p className="text-sm font-medium text-teal-900 dark:text-teal-100 mb-2">
                  Configure your API key in the Desktop App
                </p>
                <p className="text-sm text-teal-700 dark:text-teal-300">
                  To use your own API key, download the{' '}
                  <a
                    href="/download"
                    className="text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                  >
                    Desktop App
                  </a>{' '}
                  and enter your Anthropic API key there. Your key will be stored securely on your local device only.
                </p>
              </div>
            )}

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
