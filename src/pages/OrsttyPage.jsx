import React, { useEffect } from 'react';
import { OrsttyChat } from '../asistente/orstty/OrsttyChat';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrsttyPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ORSTTY Asistente | RASTRO';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="orstty-page-wrapper">
      <style>{`
        .orstty-page-wrapper {
          height: calc(100dvh - 54px);
          max-height: calc(100dvh - 54px);
          padding-top: 6px !important;
          padding-bottom: 68px !important;
          padding-left: 8px;
          padding-right: 8px;
          max-width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.12) 0%, transparent 60%);
        }
        @media (min-width: 768px) {
          .orstty-page-wrapper {
            height: 100vh;
            max-height: 100vh;
            padding-top: 84px !important;
            padding-bottom: 20px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            max-width: 860px;
          }
        }
        @media (min-width: 1025px) {
          .orstty-page-wrapper {
            padding-top: 88px !important;
            padding-bottom: 24px !important;
            max-width: 900px;
          }
        }
      `}</style>

      {/* Header bar with Back button and Status */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
          padding: '0 2px',
          flexShrink: 0
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(124, 58, 237, 0.25)',
            background: 'var(--card-bg, rgba(255, 255, 255, 0.9))',
            color: 'var(--text-main, #1F2937)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)',
            transition: 'all 0.15s ease'
          }}
        >
          <ArrowLeft size={14} color="#7C3AED" />
          <span>Volver</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '99px',
              background: 'rgba(124, 58, 237, 0.12)',
              border: '1px solid rgba(124, 58, 237, 0.28)',
              color: '#7C3AED',
              fontSize: '0.72rem',
              fontWeight: 800
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7C3AED', boxShadow: '0 0 8px #7C3AED' }} />
            <span>ORSTTY IA · Morado</span>
          </div>
        </div>
      </div>

      {/* Main Chat Component */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        <OrsttyChat />
      </motion.div>
    </div>
  );
}
