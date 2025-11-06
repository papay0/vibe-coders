import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(to bottom right, #f0fdfa, #cffafe, #dbeafe)',
          padding: '80px',
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              background: 'linear-gradient(to bottom right, #0d9488, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '24px',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              A
            </span>
          </div>
          <span
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #0d9488, #06b6d4)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Appily
          </span>
        </div>

        {/* Main Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#0f172a',
              lineHeight: '1.2',
              margin: 0,
              marginBottom: '24px',
              maxWidth: '1000px',
            }}
          >
            The AI Development Platform
          </h1>
          <h2
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #7c3aed, #0d9488, #2563eb)',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: '1.2',
              margin: 0,
            }}
          >
            for Non-Technical Builders
          </h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
