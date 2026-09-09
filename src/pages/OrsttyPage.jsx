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
          min-height: 100vh;
          padding: 16px 12px 120px;
          max-width: 900px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .orstty-page-wrapper {
            padding-top: 112px !important;
            padding-bottom: 60px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
        @media (min-width: 1025px) {
          .orstty-page-wrapper {
            padding-top: 118px !important;
            padding-bottom: 70px !important;
          }
        }
      `}</style>

      {/* Header bar with Back button and Status */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          padding: '0 4px'
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '12px',
            border: '1px solid var(--card-border, rgba(0,0,0,0.1))',
            background: 'var(--card-bg, rgba(255,255,255,0.7))',
            color: 'var(--text-main, #000000)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <ArrowLeft size={15} />
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
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#10B981',
              fontSize: '0.74rem',
              fontWeight: 800
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} />
            <span>ORSTTY Online</span>
          </div>
        </div>
      </div>

      {/* Main Chat Component */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        <OrsttyChat />
      </motion.div>
    </div>
  );
}
