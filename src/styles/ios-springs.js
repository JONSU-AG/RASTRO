// Apple iOS Spring Physics & Animation Presets para Framer Motion
// Diseñado para otorgar fluidez nativa iPhone a modales, tarjetas, botones y Dynamic Island

export const IOS_SPRINGS = {
  // Píldoras y botones de respuesta instantánea (Dynamic Island)
  snappy: {
    type: 'spring',
    stiffness: 460,
    damping: 30,
    mass: 0.7
  },
  // Modales y hojas inferiores (Sheets estilo iOS)
  sheet: {
    type: 'spring',
    stiffness: 360,
    damping: 32,
    mass: 0.9
  },
  // Micro-interacciones de tap (efecto táctil háptico)
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 24,
    mass: 0.8
  },
  // Desvanecimientos elegantes
  gentle: {
    type: 'spring',
    stiffness: 280,
    damping: 28,
    mass: 1
  }
};

export const IOS_INTERACTIONS = {
  tapSmall: { scale: 0.94 },
  tapCard: { scale: 0.97, y: 2 },
  hoverCard: { scale: 1.02, y: -2 },
  hoverGlow: (color) => ({
    boxShadow: `0 12px 32px ${color}35, 0 0 20px ${color}20`
  })
};
