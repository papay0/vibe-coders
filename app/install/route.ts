import { NextResponse } from 'next/server';

/**
 * Redirect /install to the raw installation script on GitHub
 *
 * This allows users to install with:
 * curl -fsSL https://vibe-coders-desktop.vercel.app/install | bash
 *
 * Or when the custom domain is set up:
 * curl -fsSL vibe-coders.app/install | bash
 */
export async function GET() {
  return NextResponse.redirect(
    'https://raw.githubusercontent.com/papay0/vibe-coders-desktop/main/install.sh',
    { status: 307 } // 307 Temporary Redirect - preserves the GET method
  );
}
