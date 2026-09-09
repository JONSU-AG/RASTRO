import React, { useEffect } from 'react';
import { UserDirectChat } from '../components/UserDirectChat';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, ArrowLeft } from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

export function Chats() {
  const [searchParams] = useSearchParams();
  const withUid = searchParams.get('with');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Mis Chats Privados | RASTRO';
  }, []);

  return (
    <div className="chats-page-wrapper">
      <style>{`
        .chats-page-wrapper {
          min-height: 100vh;
          padding: 16px 12px 120px;
          max-width: 900px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .chats-page-wrapper {
            padding-top: 112px !important;
            padding-bottom: 70px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
        @media (min-width: 1025px) {
          .chats-page-wrapper {
            padding-top: 118px !important;
            padding-bottom: 80px !important;
          }
        }
      `}</style>

      {/* Header bar: Volver + Acceso rápido a ORSTTY Asistente */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
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

        <Link
          to="/orstty"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '12px',
            border: '1px solid rgba(0, 122, 255, 0.3)',
            background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.12), rgba(139, 92, 246, 0.12))',
            color: 'var(--accent-color, #007AFF)',
            fontSize: '0.78rem',
            fontWeight: 800,
            textDecoration: 'none'
          }}
        >
          <Sparkles size={14} />
          <span>Abrir Asistente ORSTTY</span>
        </Link>
      </div>

      {/* User to User Direct Messages */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        <UserDirectChat isOwnProfile={true} initialChatWithUid={withUid} />
      </motion.div>
    </div>
  );
}


