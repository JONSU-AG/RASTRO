import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('RASTRO ErrorBoundary:', error, info);
    document.body.style.overflow = '';
    if (this.props.onError) this.props.onError();
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '32px 20px', textAlign: 'center', maxWidth: '520px', margin: '40px auto' }}>
          <h2 style={{ color: 'var(--text-main)', fontWeight: 800, marginBottom: '8px' }}>Algo salió mal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', wordBreak: 'break-word' }}>
            {String(this.state.error?.message || this.state.error || 'Error inesperado')}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '10px 18px', borderRadius: '12px', border: 'none', background: 'var(--accent-color)', color: '#fff', fontWeight: 800, cursor: 'pointer', marginRight: '8px' }}
          >
            Reintentar
          </button>
          <button
            onClick={() => window.location.hash = '#/'}
            style={{ padding: '10px 18px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}
          >
            Ir a Inicio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
