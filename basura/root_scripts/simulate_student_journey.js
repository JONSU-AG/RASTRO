import { SUBJECTS_CONFIG, buildLessonWithRichTheory, normalizeSubject } from './src/data/learningPathData.js';
import fs from 'fs';

const banco = JSON.parse(fs.readFileSync('./src/data/bancoPreguntasCepreunsa.json', 'utf-8'));

console.log('======================================================================');
console.log('🎓 SIMULACIÓN DE APRENDIZAJE: ESTUDIANTE PREUNSA EN LOS 15 CURSOS');
console.log('======================================================================\n');

const report = [];

for (const subject of SUBJECTS_CONFIG) {
  const normSub = normalizeSubject(subject.id);
  const questions = banco.filter(q => 
    normalizeSubject(q.asignatura) === normSub && 
    q.options && 
    q.options.length >= 2 &&
    q.answer !== undefined &&
    q.answer !== null &&
    q.answer >= 0 &&
    q.answer < q.options.length &&
    q.options[q.answer] &&
    q.options[q.answer].trim().length > 0
  );

  // Construir lección 1 como la experimenta el estudiante
  const lesson = buildLessonWithRichTheory(subject.id, 1, questions, 0);

  const studentExperience = {
    curso: subject.id,
    area: subject.area,
    icon: subject.icon,
    color: subject.color,
    bancoPool: questions.length,
    // Paso 1: Lectura de Teoría
    teoria: {
      titulo: lesson.theory.title,
      seccionesCount: lesson.theory.sections.length,
      tieneMarcoGeneral: lesson.theory.sections.some(s => s.heading.toLowerCase().includes('general')),
      tieneCasosParticulares: lesson.theory.sections.some(s => s.heading.toLowerCase().includes('particulares')),
      tieneDeduccionExamen: lesson.theory.sections.some(s => s.heading.toLowerCase().includes('deducción') || s.heading.toLowerCase().includes('admisión')),
      takeaway: lesson.theory.takeaway,
      extractoGeneral: lesson.theory.sections[0]?.body?.slice(0, 140) + '...'
    },
    // Paso 2: Resolución Reto 1 (Opción Múltiple del Banco)
    reto1: {
      tipo: lesson.challenges[0]?.type,
      pregunta: lesson.challenges[0]?.question,
      opcionesTotal: lesson.challenges[0]?.options?.length,
      respuestaCorrecta: lesson.challenges[0]?.options[lesson.challenges[0]?.correctIndex],
      indiceCorrecto: lesson.challenges[0]?.correctIndex,
      explicacion: lesson.challenges[0]?.explanation?.slice(0, 120) + '...',
      requiereLapizPapel: !!lesson.challenges[0]?.paperHint
    },
    // Paso 3: Resolución Reto 2 (Completar espacio - Cloze)
    reto2: {
      tipo: lesson.challenges[1]?.type,
      oracion: lesson.challenges[1]?.sentence,
      palabraObjetivo: lesson.challenges[1]?.targetWord,
      chipsContieneObjetivo: lesson.challenges[1]?.chips?.includes(lesson.challenges[1]?.targetWord)
    },
    // Veredicto
    aprobado: true
  };

  // Validaciones críticas
  if (
    !studentExperience.teoria.tieneMarcoGeneral ||
    !studentExperience.teoria.tieneCasosParticulares ||
    !studentExperience.teoria.tieneDeduccionExamen ||
    studentExperience.reto1.opcionesTotal < 2 ||
    !studentExperience.reto1.respuestaCorrecta ||
    !studentExperience.reto2.chipsContieneObjetivo
  ) {
    studentExperience.aprobado = false;
  }

  report.push(studentExperience);
}

// Imprimir reporte detallado curso por curso
for (const [idx, r] of report.entries()) {
  console.log(`----------------------------------------------------------------------`);
  console.log(`${idx + 1}. [${r.icon} ${r.curso.toUpperCase()}] • Área: ${r.area} • Pool Banco: ${r.bancoPool} preguntas`);
  console.log(`   📖 1. FASE TEÓRICA (De lo General a lo Particular):`);
  console.log(`      • Título: "${r.teoria.titulo}"`);
  console.log(`      • Fundamento General (Principio Universal): ${r.teoria.tieneMarcoGeneral ? '✅ Presente' : '❌ Falta'}`);
  console.log(`      • Casos Particulares / Clasificación:       ${r.teoria.tieneCasosParticulares ? '✅ Presente' : '❌ Falta'}`);
  console.log(`      • Deducción Práctica Examen:               ${r.teoria.tieneDeduccionExamen ? '✅ Presente' : '❌ Falta'}`);
  console.log(`      • Resumen Clave: "${r.teoria.takeaway}"`);
  console.log(`   🎯 2. FASE PRÁCTICA (Deducción del Caso Particular CEPREUNSA):`);
  console.log(`      • Pregunta: "${r.reto1.pregunta?.slice(0, 80)}..."`);
  console.log(`      • Opciones disponibles: ${r.reto1.opcionesTotal}`);
  console.log(`      • Respuesta esperada por CEPREUNSA: "${r.reto1.respuestaCorrecta}" (Opción ${String.fromCharCode(65 + r.reto1.indiceCorrecto)})`);
  console.log(`      • ¿Requiere trazo en papel/lápiz?: ${r.reto1.requiereLapizPapel ? '✏️ SÍ (Física/Álgebra/Raz. Mat.)' : 'No (Conceptual)'}`);
  console.log(`   🧠 3. FASE DE SÍNTESIS (Reto Cloze):`);
  console.log(`      • Enunciado: "${r.reto2.oracion}"`);
  console.log(`      • Ficha Clave: "${r.reto2.palabraObjetivo}" (En chips: ${r.reto2.chipsContieneObjetivo ? '✅ SÍ' : '❌ NO'})`);
  console.log(`   🏁 VEREDICTO PEDAGÓGICO: ${r.aprobado ? '🌟 EXCELENTE (Cumple estructura General -> Particular)' : '⚠️ DEFICIENTE'}\n`);
}

const allPassed = report.every(r => r.aprobado);
console.log('======================================================================');
console.log(`BALANCE FINAL: ${allPassed ? '✅ TODOS LOS 15 CURSOS FUNCIONAN AL 100%' : '❌ ALGUNOS CURSOS PRESENTAN INCONSISTENCIAS'}`);
console.log('======================================================================');
