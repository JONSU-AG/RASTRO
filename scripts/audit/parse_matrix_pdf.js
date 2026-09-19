import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const pdfPath = 'C:\\Users\\Usuario\\Desktop\\CEPREUNSA\\Tomos\\RCU-0028-Aprobacion-de-TEMARIO-y-MATRIZ-ADMISION-2027.pdf';

if (fs.existsSync(pdfPath)) {
  const dataBuffer = fs.readFileSync(pdfPath);
  pdf(dataBuffer).then(function(data) {
    console.log("PDF parsed successfully!");
    console.log("Pages:", data.numpages);
    console.log("Text length:", data.text.length);
    fs.writeFileSync('extracted_official_matrix_text.txt', data.text, 'utf-8');
    console.log("Saved to extracted_official_matrix_text.txt");
  }).catch(err => {
    console.error("Error parsing pdf:", err);
  });
} else {
  console.log("PDF file not found:", pdfPath);
}
