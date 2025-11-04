# PRD: Vibe Coders Backend

**Repository**: `vibe-coders`
**Domain**: `vibe-coders.app`
**Deployment**: Vercel
**Purpose**: Cloud backend for authentication, API proxy, billing, and landing page

---

## Overview

The Vibe Coders backend is a Next.js application hosted on Vercel that serves as:
1. **Marketing Landing Page** - Public-facing website
2. **Authentication Provider** - Google OAuth & token management
3. **Claude API Proxy** - Forwards Claude Code requests with billing/rate limiting
4. **Subscription Manager** - Handles payments and usage tracking
5. **Analytics Dashboard** - User usage stats

This backend works with the local app (`vibe-coders-desktop`) that users install on their machines.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **React**: React 19.2
- **Language**: TypeScript
- **Deployment**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk (email, Google, GitHub OAuth)
- **Payments**: Stripe
- **API**: REST endpoints for proxy, API key generation, usage tracking
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
  - Pre-built, accessible components
  - Customizable with Tailwind
  - Copy-paste component library

---

## Core Features

### 1. Landing Page

**Route**: `/` (Homepage)

**Sections**:
```
┌─────────────────────────────────────────────────┐
│  Hero Section                                    │
│  - Headline: "Code with AI, No Terminal Fear"  │
│  - Subheadline: "Beautiful UI for Claude Code" │
│  - Installation command (prominent)             │
│  - Demo video or GIF                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Installation Section                            │
│  ┌──────────────────────────────────────┐       │
│  │ curl -fsSL vibe-coders.app/install  │       │
│  │                                 | sh  │       │
│  │          [Copy Command]              │       │
│  └──────────────────────────────────────┘       │
│  Works on Mac, Linux, Windows (WSL)            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Features Section                                │
│  - Project Management                           │
│  - AI-Powered Git Commits                       │
│  - No Terminal Required                         │
│  - Full Code Ownership                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Pricing Section                                 │
│  Two Plans:                                      │
│  - BYOK (Free) - Bring Your Own Key            │
│  - Premium ($20/month) - Unlimited              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  How It Works                                    │
│  1. Install with one command                    │
│  2. Choose BYOK or sign up for cloud key       │
│  3. Add your projects                           │
│  4. Click buttons instead of typing commands    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  CTA Section                                     │
│  [Get Started] → Sign up with Clerk             │
│  [View Documentation]                           │
└─────────────────────────────────────────────────┘
```

**Implementation**: `app/page.tsx`

---

### 2. Authentication & User Dashboard

#### Clerk Authentication Setup

**Implementation**: Clerk

**Authentication Providers**:
- Email/Password
- Google OAuth
- GitHub OAuth

**Protected Routes**:
- `/home` - User dashboard (requires authentication)
- `/home/create` - API key creation (requires authentication)
- `/api/keys/*` - API key management endpoints

**Files**:
- `app/home/page.tsx` - User dashboard
- `app/home/create/page.tsx` - API key creation page
- `middleware.ts` - Clerk middleware for route protection
- `lib/clerk.ts` - Clerk utilities

**Setup**:
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/home(.*)',
  '/api/keys(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

#### User Dashboard (/home)

**Purpose**: Main dashboard for authenticated users

**Features**:
- View API keys
- Create new API keys
- Manage subscription
- View usage statistics

**Implementation**:
```typescript
// app/home/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) redirect('/');

  const user = await currentUser();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Get user's API keys
  const { data: keys } = await supabase
    .from('api_keys')
    .select('*')
    .eq('clerk_user_id', userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {user?.firstName || user?.emailAddresses[0].emailAddress}!
          </h2>
          <p className="text-gray-600">
            Manage your API keys for the Vibe Coders local app
          </p>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <a
              href="/home/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Create New Key
            </a>
          </div>

          {keys && keys.length > 0 ? (
            <div className="space-y-3">
              {keys.map((key) => (
                <div key={key.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-mono text-sm">
                        {key.key.substring(0, 20)}...
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Created: {new Date(key.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No API keys yet. Create one to get started!</p>
          )}
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Usage This Month</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Requests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">$0.00</div>
              <div className="text-sm text-gray-600">Cost</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### API Key Creation (/home/create)

**Purpose**: Generate API key for local app

**Implementation**:
```typescript
// app/home/create/page.tsx
'use client';

import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateKeyPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);

    const response = await fetch('/api/keys/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();
    setNewKey(data.key);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create API Key</h1>

      {!newKey ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Key Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Local App Key"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create API Key'}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">✅ Key Created!</h2>
            <p className="text-gray-600 mb-4">
              Copy this key and paste it in your local app. You won't be able to see it again.
            </p>

            <div className="bg-gray-50 border rounded-lg p-4 font-mono text-sm break-all">
              {newKey}
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(newKey)}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              📋 Copy to Clipboard
            </button>
          </div>

          <button
            onClick={() => router.push('/home')}
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
```

#### API Key Generation Endpoint

**Route**: `/api/keys/create`

**Purpose**: Generate API key for authenticated user

**Implementation**:
```typescript
// app/api/keys/create/route.ts
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await req.json();

  // Generate secure API key
  const key = `vc_${randomBytes(32).toString('hex')}`;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Store in database
  const { error } = await supabase
    .from('api_keys')
    .insert({
      clerk_user_id: userId,
      key,
      name,
      created_at: new Date().toISOString(),
    });

  if (error) {
    return Response.json({ error: 'Failed to create key' }, { status: 500 });
  }

  return Response.json({ key });
}
```

---

### 3. Claude API Proxy

**Based on**: `proxy.js` from our earlier work

**Route**: `/api/proxy/v1/*`

**Purpose**:
- Validate user auth tokens
- Check subscriptions
- Apply rate limiting
- Forward to Anthropic API
- Track usage

**Implementation**:
```typescript
// app/api/proxy/v1/[...path]/route.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  // 1. Extract auth token
  const authToken = req.headers.get('x-auth-token') ||
                    req.headers.get('authorization')?.replace('Bearer ', '');

  if (!authToken) {
    return Response.json(
      { error: 'Missing auth token' },
      { status: 401 }
    );
  }

  // 2. Validate token and get user
  const { data: user, error } = await supabase
    .from('users')
    .select(`
      *,
      subscriptions (
        plan,
        status,
        byok_api_key
      )
    `)
    .eq('auth_token', authToken)
    .single();

  if (error || !user) {
    return Response.json(
      { error: 'Invalid auth token' },
      { status: 401 }
    );
  }

  // 3. Check subscription
  const subscription = user.subscriptions?.[0];
  if (!subscription || subscription.status !== 'active') {
    return Response.json(
      { error: 'No active subscription' },
      { status: 403 }
    );
  }

  // 4. Determine API key to use
  let apiKey: string;
  if (subscription.plan === 'byok') {
    // Use user's own key
    apiKey = decrypt(subscription.byok_api_key);
  } else {
    // Use shared key
    apiKey = process.env.ANTHROPIC_API_KEY!;
  }

  // 5. Check rate limits (premium users only)
  if (subscription.plan === 'premium') {
    const isRateLimited = await checkRateLimit(user.id);
    if (isRateLimited) {
      return Response.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
  }

  // 6. Forward to Anthropic
  const path = params.path.join('/');
  const anthropicUrl = `https://api.anthropic.com/v1/${path}`;

  const response = await fetch(anthropicUrl, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'content-type': req.headers.get('content-type') || 'application/json',
      'anthropic-version': req.headers.get('anthropic-version') || '2023-06-01',
      'anthropic-beta': req.headers.get('anthropic-beta') || '',
    },
    body: await req.text(),
  });

  // 7. Track usage
  if (response.ok && subscription.plan === 'premium') {
    const data = await response.clone().json();
    if (data.usage) {
      await trackUsage(user.id, data.usage);
    }
  }

  // 8. Return response
  const responseData = await response.text();
  return new Response(responseData, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json',
    },
  });
}

// Helper: Check rate limit
async function checkRateLimit(userId: string): Promise<boolean> {
  const now = new Date();
  const minuteKey = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM

  const { data } = await supabase
    .from('rate_limits')
    .select('count')
    .eq('user_id', userId)
    .eq('minute_key', minuteKey)
    .single();

  if (data && data.count >= 60) {
    return true; // Rate limited
  }

  // Increment counter
  await supabase.rpc('increment_rate_limit', {
    p_user_id: userId,
    p_minute_key: minuteKey,
  });

  return false;
}

// Helper: Track usage
async function trackUsage(
  userId: string,
  usage: { input_tokens: number; output_tokens: number }
) {
  await supabase.rpc('track_usage', {
    p_user_id: userId,
    p_input_tokens: usage.input_tokens,
    p_output_tokens: usage.output_tokens,
  });
}

// Helper: Decrypt BYOK API key
function decrypt(encrypted: string): string {
  // Implementation using crypto
  const crypto = require('crypto');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'),
    Buffer.from(encrypted.slice(0, 24), 'hex')
  );
  // ... decryption logic
  return decrypted;
}
```

---

### 4. Installation Script Endpoint

**Route**: `/install`

**Purpose**: Serve installation script from GitHub

**Implementation**:
```typescript
// app/install/route.ts
export async function GET() {
  const GITHUB_RAW_URL =
    'https://raw.githubusercontent.com/yourusername/vibe-coders-installer/main/install.sh';

  const response = await fetch(GITHUB_RAW_URL);
  const script = await response.text();

  return new Response(script, {
    headers: {
      'Content-Type': 'text/x-shellscript',
      'Content-Disposition': 'inline; filename="install.sh"',
    },
  });
}
```

**Versioned endpoint**:
```typescript
// app/install/[version]/route.ts
export async function GET(
  req: Request,
  { params }: { params: { version: string } }
) {
  const tag = params.version || 'main';
  const url = `https://raw.githubusercontent.com/yourusername/vibe-coders-installer/${tag}/install.sh`;

  const response = await fetch(url);
  if (!response.ok) {
    return new Response('Version not found', { status: 404 });
  }

  const script = await response.text();
  return new Response(script, {
    headers: {
      'Content-Type': 'text/x-shellscript',
    },
  });
}
```

---

### 5. Subscription Management

#### Plans

**Two subscription plans**:
1. **BYOK** (Free) - User provides their own Anthropic API key
2. **Premium** ($20/month) - Unlimited usage with shared API key

#### Stripe Integration

**Webhook**: `/api/webhooks/stripe`

**Implementation**:
```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancel(event.data.object);
      break;
  }

  return Response.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  // Create subscription in database
  await supabase.from('subscriptions').insert({
    user_id: session.metadata?.userId,
    plan: 'premium',
    status: 'active',
    stripe_subscription_id: session.subscription,
  });
}
```

#### Checkout Endpoint

**Route**: `/api/checkout`

```typescript
// app/api/checkout/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { userId, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // $20/month price
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    metadata: {
      userId,
    },
  });

  return Response.json({ url: session.url });
}
```

---

### 6. Usage Dashboard

**Route**: `/api/usage`

**Purpose**: Return user's usage statistics

```typescript
// app/api/usage/route.ts
export async function GET(req: Request) {
  const authToken = req.headers.get('authorization')?.replace('Bearer ', '');

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('auth_token', authToken)
    .single();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get current month usage
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: usage } = await supabase
    .from('usage')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startOfMonth.toISOString())
    .order('date', { ascending: false });

  const totalRequests = usage?.reduce((sum, day) => sum + day.requests, 0) || 0;
  const totalInputTokens = usage?.reduce((sum, day) => sum + day.input_tokens, 0) || 0;
  const totalOutputTokens = usage?.reduce((sum, day) => sum + day.output_tokens, 0) || 0;

  return Response.json({
    month: startOfMonth.toISOString().slice(0, 7), // YYYY-MM
    requests: totalRequests,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    totalTokens: totalInputTokens + totalOutputTokens,
    dailyUsage: usage,
  });
}
```

---

## Database Schema (Supabase)

```sql
-- Users table (synced with Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys table (for local app authentication)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL, -- Format: vc_xxxxx
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('byok', 'premium')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  stripe_subscription_id TEXT,
  byok_api_key TEXT, -- encrypted, only for BYOK plan
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Usage table
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  date DATE NOT NULL,
  requests INTEGER DEFAULT 0,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clerk_user_id, date)
);

-- Rate limiting table
CREATE TABLE rate_limits (
  clerk_user_id TEXT NOT NULL,
  minute_key TEXT NOT NULL, -- Format: YYYY-MM-DDTHH:MM
  count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (clerk_user_id, minute_key)
);

-- Indexes for faster queries
CREATE INDEX idx_api_keys_user ON api_keys(clerk_user_id);
CREATE INDEX idx_api_keys_key ON api_keys(key) WHERE is_active = TRUE;
CREATE INDEX idx_usage_user_date ON usage(clerk_user_id, date DESC);
CREATE INDEX idx_rate_limits_user ON rate_limits(clerk_user_id, minute_key);

-- RPC function to increment rate limit
CREATE OR REPLACE FUNCTION increment_rate_limit(
  p_clerk_user_id TEXT,
  p_minute_key TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO rate_limits (clerk_user_id, minute_key, count)
  VALUES (p_clerk_user_id, p_minute_key, 1)
  ON CONFLICT (clerk_user_id, minute_key)
  DO UPDATE SET count = rate_limits.count + 1;
END;
$$ LANGUAGE plpgsql;

-- RPC function to track usage
CREATE OR REPLACE FUNCTION track_usage(
  p_clerk_user_id TEXT,
  p_input_tokens INTEGER,
  p_output_tokens INTEGER
) RETURNS VOID AS $$
BEGIN
  INSERT INTO usage (clerk_user_id, date, requests, input_tokens, output_tokens)
  VALUES (p_clerk_user_id, CURRENT_DATE, 1, p_input_tokens, p_output_tokens)
  ON CONFLICT (clerk_user_id, date)
  DO UPDATE SET
    requests = usage.requests + 1,
    input_tokens = usage.input_tokens + p_input_tokens,
    output_tokens = usage.output_tokens + p_output_tokens;
END;
$$ LANGUAGE plpgsql;
```

---

## Environment Variables

Create `.env.local`:

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-xxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID=price_xxx  # $20/month price ID

# Encryption (for BYOK keys)
ENCRYPTION_KEY=generate-32-byte-hex-key

# App
NEXT_PUBLIC_URL=https://vibe-coders.app
```

---

## File Structure

```
vibe-coders/
├── app/
│   ├── page.tsx                        # Landing page (/)
│   ├── home/
│   │   ├── page.tsx                    # User dashboard (requires auth)
│   │   └── create/
│   │       └── page.tsx                # API key creation (requires auth)
│   ├── pricing/
│   │   └── page.tsx                    # Pricing page
│   ├── docs/
│   │   └── page.tsx                    # Documentation
│   ├── install/
│   │   ├── route.ts                    # Installation script endpoint
│   │   └── [version]/
│   │       └── route.ts                # Versioned script endpoint
│   ├── api/
│   │   ├── keys/
│   │   │   └── create/
│   │   │       └── route.ts            # API key generation
│   │   ├── proxy/
│   │   │   └── v1/
│   │   │       └── [...path]/
│   │   │           └── route.ts        # Claude API proxy
│   │   ├── checkout/
│   │   │   └── route.ts                # Stripe checkout
│   │   ├── usage/
│   │   │   └── route.ts                # Usage stats
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts            # Stripe webhooks
│   └── layout.tsx                      # Root layout with ClerkProvider
├── components/
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Pricing.tsx
│   └── InstallCommand.tsx
├── lib/
│   ├── clerk.ts                        # Clerk utilities
│   ├── supabase.ts                     # Supabase client
│   └── stripe.ts                       # Stripe utilities
├── middleware.ts                       # Clerk middleware for protected routes
├── .env.local                          # Environment variables
├── package.json
├── next.config.js
└── PRD-Backend.md                      # This file
```

---

## Development Workflow

### Project Initialization

```bash
# Create Next.js 16 project
npx create-next-app@latest vibe-coders --typescript --tailwind --app --turbopack

# Navigate to project
cd vibe-coders

# Initialize Shadcn UI
npx shadcn@latest init

# When prompted, select:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate (or your preference)
# - CSS variables: Yes

# Install commonly used components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add separator
npx shadcn@latest add toast
```

### Local Development

```bash
# Install dependencies
npm install

# Set up Supabase
# 1. Create project at supabase.com
# 2. Run SQL schema from above
# 3. Copy connection details to .env.local

# Set up Stripe
# 1. Create product ($20/month subscription)
# 2. Copy keys to .env.local
# 3. Set up webhook endpoint

# Set up Google OAuth
# 1. Create OAuth app in Google Console
# 2. Add authorized redirect: http://localhost:3000/api/auth/callback/google
# 3. Copy credentials to .env.local

# Run development server
npm run dev
```

### Testing

```bash
# Test landing page
open http://localhost:3000

# Test installation script
curl http://localhost:3000/install

# Test auth flow
# (requires local app running)

# Test proxy
# (requires auth token from local app)
```

---

## Deployment Checklist

### Vercel Setup

1. Connect GitHub repo to Vercel
2. Add environment variables
3. Set up custom domain: vibe-coders.app
4. Enable automatic deployments

### Stripe Setup

1. Create production webhook endpoint
2. Update webhook secret in env vars
3. Test webhook with Stripe CLI

### Google OAuth

1. Add production redirect URL
2. Verify domain ownership

### Supabase

1. Copy production connection details
2. Run database migrations
3. Set up Row Level Security (RLS) policies

---

## Success Metrics

- Successful auth flows per day
- Active subscriptions (premium vs BYOK)
- API requests proxied
- Average tokens per user
- Conversion rate (free → premium)
- Error rate on proxy endpoint

---

## Security Considerations

1. **API Key Storage**: BYOK keys encrypted with AES-256
2. **Rate Limiting**: 60 requests/minute for premium users
3. **Token Expiration**: JWT tokens expire after 30 days
4. **HTTPS Only**: All communication over HTTPS
5. **CORS**: Restrict to localhost:3000 and production domains
6. **Webhook Validation**: Verify Stripe webhook signatures

---

## Next Steps

1. Set up Next.js project
2. Configure Supabase database
3. Implement authentication flow
4. Build landing page
5. Implement Claude API proxy
6. Set up Stripe integration
7. Deploy to Vercel
8. Test end-to-end with local app

---

*Document Version: 1.0*
*Last Updated: 2025-11-04*
*Companion: PRD-Local.md (local app)*
