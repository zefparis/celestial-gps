/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'bg-void': 'var(--bg-void)',
        'bg-deep': 'var(--bg-deep)',
        'bg-base': 'var(--bg-base)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-surface': 'var(--bg-surface)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'accent-tertiary': 'var(--accent-tertiary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-muted': 'var(--text-muted)',
        success: 'var(--success)',
        'success-dim': 'var(--success-dim)',
        warning: 'var(--warning)',
        'warning-dim': 'var(--warning-dim)',
        danger: 'var(--danger)',
        'danger-dim': 'var(--danger-dim)',
        info: 'var(--info)',
        'border-subtle': 'var(--border-subtle)',
        'border-normal': 'var(--border-normal)',
        'border-strong': 'var(--border-strong)',
        'glass-bg': 'var(--glass-bg)',
        'glass-border': 'var(--glass-border)'
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'holographic': 'holographic 3s ease infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            filter: 'brightness(1) drop-shadow(0 0 20px rgba(0, 212, 255, 0.4))' 
          },
          '50%': { 
            filter: 'brightness(1.2) drop-shadow(0 0 30px rgba(0, 212, 255, 0.6))' 
          }
        },
        holographic: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      boxShadow: {
        'glow': '0 0 32px rgba(0, 212, 255, 0.2)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.4)',
        'glow-blue': '0 0 20px rgba(0, 153, 255, 0.3)',
        'glow-success': '0 0 20px rgba(0, 255, 136, 0.3)',
        'glow-danger': '0 0 20px rgba(255, 51, 102, 0.3)'
      }
    }
  },
  plugins: []
}
