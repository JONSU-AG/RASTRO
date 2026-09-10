import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  BookOpen, 
  Play, 
  Cpu, 
  Layers,
  ArrowRight,
  X,
  Power
} from 'lucide-react';
import { process as processWithEngine, getTool, getContext, clearContext, updateContext } from './orstty-engine.js';
import { getResponse } from './orstty-personality.js';
import { registerAllRastroTools } from './rastro-tools.js';
import { getDesviationResponse, searchKnowledge, getKnowledgeResponse } from './orstty-knowledge.js';
import { getConversationalResponse, detectarApodo, getApodoResponse, getRecuperarNombreResponse, getApodo, setApodo } from './orstty-conversacion.js';
import { procesarIntencionAvanzada, detectarEstadoEmocional } from './orstty-avanzado.js';
import { getLocalAIResponse } from './orstty-ai-local.js';
import { getGroqResponse, hasApiKey, getKeyCount } from './orstty-groq-free.js';
import { executeUniversalSearch } from './orstty-search-indexer.js';
import { reasonAboutQuery } from './orstty-reasoning.js';
import { OrsttyAvatar, ORSTTY_STATES } from './OrsttyAvatar';
import { OrsttyMiniCard } from './OrsttyMiniCard';
import { InChatVideoModal, InChatPreviewModal } from './OrsttyModals';
import { useAuth } from '../../context/AuthContext';

// Aseguramos que las herramientas estén registradas una vez
registerAllRastroTools();

const QUICK_STARTERS = [
  '🏛️ Ver cursos y academias',
  '🎬 Videos de biología semana 3',
  '📄 Separatas y tomos de química',
  '📚 Libros preuniversitarios',
  '📝 Simulador de examen',
  '🧬 Explicar fases de mitosis',
  '🎯 Orientación para Medicina'
];

const INITIAL_MESSAGE = {
  id: 'welcome',
  sender: 'orstty',
  text: '¡Hola! Soy ORSTTY 👋 Tu asistente inteligente de RASTRO. Puedo buscar videos, materiales, cursos de academias (Briceño, Esparta, Kelsen), libros oficiales y simulacros UNSA. También te explico conceptos de materias y te oriento según tu carrera. ¿Qué deseas estudiar hoy?',
  suggestions: ['Ver cursos', 'Simulador de examen', 'Tomos CEPREUNSA', 'Explicar mitosis'],
  timestamp: Date.now()
};

// Mensaje de bienvenida con Ollama
const OLLAMA_WELCOME = {
  id: 'welcome-ollama',
  sender: 'orstty',
  text: '¡Hola! Soy ORSTTY 👋 Tu asistente inteligente de RASTRO. Puedo buscar videos, materiales, cursos, libros y simulacros. También puedo explicar conceptos con profundidad y darte consejos para tu postulación. ¿Qué necesitas?',
  suggestions: ['Ver cursos', 'Simulador', 'Videos de biología', 'Orientación Medicina'],
  timestamp: Date.now()
};

const STORAGE_KEY = 'rastro_orstty_chat_history';

export function OrsttyChat({ 
  onClose = null,
  isDrawer = false,
  className = '' 
}) {
  const { user } = useAuth();
  
  // Estado del motor (avatar)
  const [engineState, setEngineState] = useState(ORSTTY_STATES.IDLE);
  
  // Apodo personalizado
  const [apodoActual, setApodoActual] = useState(() => getApodo());
  
  // Historial de mensajes
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [INITIAL_MESSAGE];
  });



  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeContext, setActiveContext] = useState(() => getContext());
  
  // Modales interactivos dentro del chat
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activePreviewModal, setActivePreviewModal] = useState(null);

  // Estado de IA (Groq)
  const [groqEnabled] = useState(() => hasApiKey());
  const [keyCount] = useState(() => getKeyCount());



  // Expansión de resultados ("Mostrar más") por id de mensaje
  const [expandedResults, setExpandedResults] = useState({});

  const messagesContainerRef = useRef(null);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  // Guardar en sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);



  // Actualizar contexto visible
  const refreshContext = () => {
    setActiveContext(getContext());
  };

  // Scroll automático sin descolocar la ventana superior
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isProcessing]);

  // Enviar mensaje al cerebro ORSTTY
  const handleSendMessage = async (textToSend) => {
    const text = (typeof textToSend === 'string' ? textToSend : inputVal).trim();
    if (!text || isProcessing) return;

    setInputVal('');
    const userMsgId = `user-${Date.now()}`;
    const newMsg = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMsg]);
    setIsProcessing(true);
    setEngineState(ORSTTY_STATES.THINKING);

    try {
      // 0. Verificar si es un apodo
      const apodoInfo = detectarApodo(text);
      if (apodoInfo) {
        let responseText;
        let suggestions = ['Buscar videos', 'Ver cursos', 'Simulador'];

        if (apodoInfo.esApodo) {
          setApodo(apodoInfo.apodo);
          setApodoActual(apodoInfo.apodo);
          responseText = getApodoResponse(apodoInfo.apodo);
        } else if (apodoInfo.esRecuperar) {
          setApodoActual('ORSTTY');
          responseText = getRecuperarNombreResponse();
        }

        const botMsgId = `orstty-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: botMsgId,
          sender: 'orstty',
          text: responseText,
          intent: 'conversacion',
          items: [],
          totalFound: 0,
          suggestions,
          timestamp: Date.now()
        }]);
        setEngineState(ORSTTY_STATES.HAPPY);
        setTimeout(() => setEngineState(ORSTTY_STATES.IDLE), 3000);
        return;
      }

      // 1. Verificar intenciones avanzadas (horarios, psicólogo, creador, etc.)
      const respuestaAvanzada = procesarIntencionAvanzada(text);
      if (respuestaAvanzada) {
        const botMsgId = `orstty-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: botMsgId,
          sender: 'orstty',
          text: respuestaAvanzada,
          intent: 'conversacion',
          items: [],
          totalFound: 0,
          suggestions: ['Buscar videos', 'Ver cursos', 'Simulador'],
          timestamp: Date.now()
        }]);
        setEngineState(ORSTTY_STATES.HAPPY);
        setTimeout(() => setEngineState(ORSTTY_STATES.IDLE), 3000);
        return;
      }

      // 2. Procesar con ORSTTY ENGINE
      const result = processWithEngine(text);
      refreshContext();

      // Pequeño retardo natural de búsqueda si hay tool
      if (result.tool) {
        setEngineState(ORSTTY_STATES.SEARCHING);
      }

      let toolOutput = null;
      let finalState = ORSTTY_STATES.FOUND;

      // 2. Si el motor determinó una Tool, ejecutarla con datos reales de RASTRO
      if (result.tool) {
        const toolFn = getTool(result.tool);
        if (typeof toolFn === 'function') {
          toolOutput = await toolFn(result.parameters, result.context);
        } else {
          console.warn(`Tool ${result.tool} not found in registered tools`);
        }
      }

      // 3. Evaluar respuesta final y estado del avatar
      let responseText = '';
      let items = [];
      let suggestions = [];

      if (toolOutput) {
        items = Array.isArray(toolOutput.items) ? toolOutput.items : [];
        responseText = toolOutput.followUp || getResponse(result.intent);
        suggestions = Array.isArray(toolOutput.suggestions) ? toolOutput.suggestions : [];

        if (items.length > 0) {
          finalState = ORSTTY_STATES.FOUND;
        } else if (toolOutput.followUp) {
          // Respetar respuesta directa y precisa de la tool
          finalState = ORSTTY_STATES.HAPPY;
        } else if (result.intent === 'saludar' || result.intent === 'ayuda') {
          finalState = ORSTTY_STATES.HAPPY;
        } else if (result.intent === 'desviar_recurso' && items.length === 0) {
          responseText = 'Déjame buscar lo que tenemos para ti...';
          finalState = ORSTTY_STATES.SEARCHING;
        } else {
          // Búsqueda universal inteligente como fallback de alta precisión
          const universal = await executeUniversalSearch({ query: text, ...result.parameters }, result.context);
          if (universal && (universal.items?.length > 0 || universal.disambiguation || universal.followUp)) {
            items = universal.items || [];
            responseText = universal.followUp || responseText;
            suggestions = universal.suggestions || suggestions;
            finalState = items.length > 0 ? ORSTTY_STATES.FOUND : ORSTTY_STATES.HAPPY;
          } else {
            finalState = ORSTTY_STATES.NO_RESULTS;
          }
        }
      } else {
        // Intento directo con Superbuscador Universal antes de IA
        const universalDirect = await executeUniversalSearch({ query: text, ...result.parameters }, result.context);
        if (universalDirect && (universalDirect.items?.length > 0 || universalDirect.followUp || universalDirect.disambiguation)) {
          items = universalDirect.items || [];
          responseText = universalDirect.followUp || 'Aquí tienes los resultados encontrados:';
          suggestions = universalDirect.suggestions || ['Ver videos', 'Ver material', 'Simulador'];
          finalState = items.length > 0 ? ORSTTY_STATES.FOUND : ORSTTY_STATES.HAPPY;
        } else {
          // Razonamiento y Comprensión Cognitiva de RASTRO y UNSA
          const reasoned = reasonAboutQuery(text, activeContext);
          if (reasoned.handled) {
            responseText = reasoned.text;
            suggestions = reasoned.suggestions || ['Ver cursos', 'Simulador', 'Tomos CEPREUNSA'];
            finalState = ORSTTY_STATES.HAPPY;
          } else {
            // Sin tool ni razonamiento directo - Usar IA para preguntas informativas
            const esPreguntaInformativa = /que es|que son|como funciona|explica|definicion|significa|dime sobre|hablame de|quien fue|quien es|quien descubrio|cuando fue|donde esta|por que|cuanto es|cual es|como se hace|historia de|ciencia/i.test(text);
        
        if (esPreguntaInformativa) {
          let aiUsed = false;

          // 1. Intentar IA externa si está habilitada
          console.log('🔍 groqEnabled:', groqEnabled, '| Texto:', text);
          if (groqEnabled) {
            setEngineState(ORSTTY_STATES.SEARCHING);
            const groqResult = await getGroqResponse(text, result, {
              materia: activeContext?.materia,
              semana: activeContext?.semana,
              academia: activeContext?.academia
            });
            console.log('🤖 Groq result:', groqResult);

            if (groqResult.used) {
              responseText = groqResult.response;
              finalState = ORSTTY_STATES.HAPPY;
              suggestions = ['Buscar videos', 'Ver cursos', 'Simulador'];
              aiUsed = true;
            }
          }

          // 2. Fallback a IA local
          if (!aiUsed) {
            const localResult = getLocalAIResponse(text);
            
            if (localResult.success) {
              responseText = localResult.response;
              finalState = ORSTTY_STATES.HAPPY;
              suggestions = ['Buscar videos', 'Ver cursos', 'Simulador'];
            } else {
              // IA local no tiene respuesta, intentar knowledge base
              const knowledge = searchKnowledge(text);
              if (knowledge.found) {
                responseText = getKnowledgeResponse(knowledge);
                finalState = ORSTTY_STATES.HAPPY;
                suggestions = ['Ver videos', 'Ver material', 'Simulacros'];
              } else {
                // Fallback a conversacional
                const conversationalResponse = getConversationalResponse(text);
                if (conversationalResponse) {
                  responseText = conversationalResponse;
                  finalState = ORSTTY_STATES.HAPPY;
                  suggestions = ['Buscar videos', 'Ver cursos', 'Simulador'];
                } else {
                  responseText = getResponse(result.intent);
                  finalState = ORSTTY_STATES.NO_RESULTS;
                  suggestions = ['Videos de biología', 'Material de química', 'Simulador'];
                }
              }
            }
          }
        } else {
          // No es pregunta informativa - usar flujo normal
          const conversationalResponse = getConversationalResponse(text);
          if (conversationalResponse) {
            responseText = conversationalResponse;
            finalState = ORSTTY_STATES.HAPPY;
            suggestions = ['Buscar videos', 'Ver cursos', 'Simulador'];
          } else {
            const knowledge = searchKnowledge(text);
            if (knowledge.found) {
              responseText = getKnowledgeResponse(knowledge);
              finalState = ORSTTY_STATES.HAPPY;
              suggestions = ['Ver videos', 'Ver material', 'Simulacros'];
            } else {
              responseText = getResponse(result.intent);
              if (result.intent === 'saludar') {
                finalState = ORSTTY_STATES.HAPPY;
                suggestions = ['Videos de biología', 'Material de química', 'Simulador', 'Ver cursos'];
              } else if (result.intent === 'no_entendido') {
                finalState = ORSTTY_STATES.CONFUSED;
                suggestions = ['Videos de biología semana 3', 'Separatas de química', 'Simulacros'];
              } else {
                finalState = ORSTTY_STATES.IDLE;
              }
            }
          }
        }
      }
    }
  }

      const botMsgId = `orstty-${Date.now()}`;
      const botMsg = {
        id: botMsgId,
        sender: 'orstty',
        text: responseText,
        intent: result.intent,
        items,
        totalFound: items.length,
        suggestions,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMsg]);
      setEngineState(finalState);
      refreshContext();

      // Regresar al estado IDLE tras unos segundos si fue found o happy
      setTimeout(() => {
        setEngineState(prev => (prev === finalState ? ORSTTY_STATES.IDLE : prev));
      }, 4000);

    } catch (err) {
      console.error('Error in ORSTTY chat processing:', err);
      setEngineState(ORSTTY_STATES.ERROR);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'orstty',
          text: 'Ocurrió un pequeño inconveniente al consultar los datos. Por favor, intenta de nuevo.',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearChat = () => {
    clearContext();
    refreshContext();
    setMessages([INITIAL_MESSAGE]);
    setEngineState(ORSTTY_STATES.IDLE);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const handleClearContext = () => {
    clearContext();
    refreshContext();
  };

  // Determina si el contexto tiene filtros activos
  const hasActiveContext = activeContext && (activeContext.materia || activeContext.semana || activeContext.tipo_recurso || activeContext.curso || activeContext.academia);

  return (
    <div 
      className={`orstty-chat-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isDrawer ? '86vh' : '100%',
        maxHeight: isDrawer ? '86vh' : '100%',
        flex: 1,
        minHeight: 0,
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        background: 'var(--card-bg, rgba(255, 255, 255, 0.9))',
        border: '1px solid rgba(124, 58, 237, 0.25)',
        borderRadius: '20px',
        boxShadow: '0 16px 40px rgba(124, 58, 237, 0.12), 0 0 0 1px rgba(124, 58, 237, 0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative'
      }}
    >
      <style>{`
        @media (max-width: 540px) {
          .hide-on-mobile {
            display: none !important;
          }
          .orstty-chat-container {
            height: 100% !important;
            max-height: 100% !important;
            border-radius: 16px !important;
          }
          .orstty-badge-tag {
            font-size: 0.6rem !important;
            padding: 1px 5px !important;
          }
          .orstty-subtitle {
            font-size: 0.68rem !important;
          }
        }
        @media (max-width: 380px) {
          .orstty-badge-tag {
            display: none !important;
          }
        }
      `}</style>

      {/* Header del Asistente */}
      <div 
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid rgba(124, 58, 237, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.02) 100%)',
          gap: '8px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
          <div style={{ flexShrink: 0 }}>
            <OrsttyAvatar 
              state={engineState} 
              size={36} 
              showBadge={true} 
              showStatusText={false} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
              <span style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main, #1F2937)', whiteSpace: 'nowrap' }}>
                {apodoActual}
              </span>
              <span 
                className="orstty-badge-tag"
                style={{
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: 'rgba(124, 58, 237, 0.12)',
                  color: '#7C3AED',
                  border: '1px solid rgba(124, 58, 237, 0.28)',
                  padding: '2px 7px',
                  borderRadius: '99px',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                  flexShrink: 0
                }}
              >
                Cerebro RASTRO
              </span>
            </div>
            <span 
              className="orstty-subtitle"
              style={{ 
                fontSize: '0.72rem', 
                color: 'var(--text-secondary, #6B7280)',
                opacity: 0.9, 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis' 
              }}
            >
              Consultas en lenguaje natural · Academias y temarios UNSA
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {/* Indicador de IA */}
          {groqEnabled && (
            <div
              title={`${keyCount} API keys activas - Rotación automática`}
              style={{
                padding: '5px 9px',
                borderRadius: '10px',
                border: '1px solid rgba(124, 58, 237, 0.28)',
                background: 'rgba(124, 58, 237, 0.1)',
                color: '#7C3AED',
                fontSize: '0.72rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}
            >
              <Sparkles size={13} color="#7C3AED" />
              <span className="hide-on-mobile">IA Activa</span>
            </div>
          )}

          {/* Botón reiniciar chat */}
          <button
            onClick={handleClearChat}
            title="Reiniciar conversación y contexto"
            style={{
              padding: '5px 9px',
              borderRadius: '10px',
              border: '1px solid rgba(124, 58, 237, 0.25)',
              background: 'rgba(124, 58, 237, 0.08)',
              color: '#7C3AED',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <RotateCcw size={13} color="#7C3AED" />
            <span className="hide-on-mobile">Reiniciar</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--text-main, #FFFFFF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Indicador de Contexto Activo (si hay materia/semana retenida) */}
      <AnimatePresence>
        {hasActiveContext && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(139, 92, 246, 0.12)',
              borderBottom: '1px solid rgba(139, 92, 246, 0.22)',
              padding: '5px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.74rem',
              color: '#E9D5FF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 700, color: '#C4B5FD' }}>
                📌 Contexto activo:
              </span>
              <span>
                {activeContext.materia && <strong>{activeContext.materia}</strong>}
                {activeContext.semana !== undefined && activeContext.semana !== null && (
                  <span> · Semana {activeContext.semana}</span>
                )}
                {activeContext.academia && <span> · {activeContext.academia}</span>}
              </span>
            </div>

            <button
              onClick={handleClearContext}
              title="Borrar tema previo para consultar libremente"
              style={{
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#C4B5FD',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                padding: '2px 8px',
                borderRadius: '6px'
              }}
            >
              <span>✕ Limpiar filtro</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cuerpo del Chat / Mensajes */}
      <div 
        ref={messagesContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          scrollBehavior: 'smooth'
        }}
      >
        {messages.map((msg) => {
          const isOrstty = msg.sender === 'orstty';
          const items = msg.items || [];
          const isExpanded = !!expandedResults[msg.id];
          const visibleItems = isExpanded ? items : items.slice(0, 3);
          const remainingCount = items.length - visibleItems.length;

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOrstty ? 'flex-start' : 'flex-end',
                width: '100%'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                  maxWidth: isOrstty ? '90%' : '82%',
                  flexDirection: isOrstty ? 'row' : 'row-reverse'
                }}
              >
                {/* Avatar */}
                {isOrstty ? (
                  <div style={{ flexShrink: 0, marginBottom: '2px' }}>
                    <OrsttyAvatar state={ORSTTY_STATES.IDLE} size={30} showBadge={false} />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7C3AED, #9333EA)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      flexShrink: 0,
                      marginBottom: '2px'
                    }}
                  >
                    {user?.username ? `@${user.username}` : (user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'Tú')}
                  </div>
                )}

                {/* Burbuja de Texto */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: isOrstty ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                    background: isOrstty
                      ? 'var(--card-bg, #1a152d)'
                      : 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                    color: isOrstty ? 'var(--text-main, #FFFFFF)' : '#FFFFFF',
                    border: isOrstty ? '1px solid rgba(139, 92, 246, 0.22)' : 'none',
                    fontSize: '0.88rem',
                    lineHeight: 1.45,
                    boxShadow: isOrstty ? '0 2px 10px rgba(0, 0, 0, 0.08)' : '0 4px 16px rgba(124, 58, 237, 0.35)',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.text}
                </div>
              </div>

              {/* Mini Tarjetas de Resultados (si la tool devolvió recursos) */}
              {isOrstty && items.length > 0 && (
                <div
                  style={{
                    marginTop: '10px',
                    marginLeft: '38px',
                    width: 'calc(100% - 38px)',
                    maxWidth: '560px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  {visibleItems.map((item, idx) => (
                    <OrsttyMiniCard
                      key={item.id || idx}
                      item={item}
                      onPlayVideo={(vid) => {
                        const targetUrl = vid.url || (vid.ytId ? `https://www.youtube.com/watch?v=${vid.ytId}` : null);
                        if (targetUrl) {
                          window.open(targetUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      onPreviewResource={(res) => setActivePreviewModal(res)}
                    />
                  ))}

                  {/* Botón Mostrar más / Mostrar menos */}
                  {items.length > 3 && (
                    <button
                      onClick={() => {
                        setExpandedResults(prev => ({
                          ...prev,
                          [msg.id]: !prev[msg.id]
                        }));
                      }}
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: '4px',
                        padding: '6px 14px',
                        borderRadius: '12px',
                        border: '1px solid rgba(124, 58, 237, 0.25)',
                        background: 'rgba(124, 58, 237, 0.08)',
                        color: '#6D28D9',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={14} />
                          <span>Mostrar menos</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} />
                          <span>Mostrar {remainingCount} resultado{remainingCount > 1 ? 's' : ''} más</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Botones de sugerencias de seguimiento */}
              {isOrstty && Array.isArray(msg.suggestions) && msg.suggestions.length > 0 && (
                <div
                  style={{
                    marginTop: '8px',
                    marginLeft: '38px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}
                >
                  {msg.suggestions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSendMessage(sug)}
                      disabled={isProcessing}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '99px',
                        border: '1px solid rgba(124, 58, 237, 0.25)',
                        background: 'rgba(124, 58, 237, 0.08)',
                        color: '#6D28D9',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Indicador de procesamiento / pensando */}
        {isProcessing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
            <OrsttyAvatar state={engineState} size={28} showBadge={false} />
            <div
              style={{
                padding: '8px 14px',
                borderRadius: '16px',
                background: 'rgba(124, 58, 237, 0.08)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                fontSize: '0.78rem',
                color: '#6D28D9',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                {engineState === ORSTTY_STATES.SEARCHING ? 'Buscando en RASTRO...' : 'ORSTTY está pensando...'}
              </motion.span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} style={{ height: '1px' }} />
      </div>

      {/* Sugerencias iniciales si el chat está limpio */}
      {messages.length <= 1 && (
        <div
          style={{
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            borderTop: '1px solid rgba(124, 58, 237, 0.15)',
            flexShrink: 0
          }}
        >
          {QUICK_STARTERS.map((qs, qIdx) => (
            <button
              key={qIdx}
              onClick={() => handleSendMessage(qs.replace(/^[^\w]+/, '').trim())}
              style={{
                padding: '5px 11px',
                borderRadius: '12px',
                background: 'rgba(124, 58, 237, 0.08)',
                border: '1px solid rgba(124, 58, 237, 0.22)',
                color: 'var(--text-main, #1F2937)',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {qs}
            </button>
          ))}
        </div>
      )}

      {/* Barra de Entrada / Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{
          padding: '8px 12px',
          borderTop: '1px solid rgba(124, 58, 237, 0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(124, 58, 237, 0.03)',
          flexShrink: 0
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`Pregunta a ${apodoActual} (cursos, videos, simulación...)`}
          disabled={isProcessing}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '14px',
            border: '1.5px solid rgba(124, 58, 237, 0.25)',
            background: 'var(--card-bg, rgba(255, 255, 255, 0.95))',
            color: 'var(--text-main, #1F2937)',
            fontSize: '0.86rem',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        {/* Botón Enviar */}
        <button
          type="submit"
          disabled={!inputVal.trim() || isProcessing}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            border: 'none',
            background: inputVal.trim() && !isProcessing
              ? 'linear-gradient(135deg, #7C3AED, #9333EA)'
              : 'rgba(124, 58, 237, 0.15)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputVal.trim() && !isProcessing ? 'pointer' : 'default',
            flexShrink: 0,
            boxShadow: inputVal.trim() && !isProcessing ? '0 4px 14px rgba(124, 58, 237, 0.35)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Send size={16} />
        </button>
      </form>

      {/* Modales Interactivos en el Chat */}
      <InChatVideoModal
        video={activeVideoModal}
        onClose={() => setActiveVideoModal(null)}
      />

      <InChatPreviewModal
        resource={activePreviewModal}
        onClose={() => setActivePreviewModal(null)}
      />
    </div>
  );
}
