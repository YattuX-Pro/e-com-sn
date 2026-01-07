import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Hasilaza Motor - Motos et Pièces Détachées au Sénégal'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'radial-gradient(circle at 25% 25%, white 2%, transparent 0%), radial-gradient(circle at 75% 75%, white 2%, transparent 0%)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px',
            zIndex: 1,
          }}
        >
          {/* Logo Circle */}
          <div
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '90px',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                fontSize: '100px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              H
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            Hasilaza Motor
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '36px',
              color: 'rgba(255,255,255,0.95)',
              maxWidth: '900px',
              lineHeight: 1.4,
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            Motos et Pièces Détachées au Sénégal
          </div>

          {/* Badge */}
          <div
            style={{
              marginTop: '40px',
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: '50px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1e293b',
              boxShadow: '0 8px 24px rgba(251,191,36,0.4)',
            }}
          >
            Leader au Sénégal
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
