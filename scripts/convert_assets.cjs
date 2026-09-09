const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function main() {
  const assetsDir = path.join(__dirname, '..', 'public', 'assets');

  const logoSvgPath = path.join(assetsDir, 'rastro-logo-16-9.svg');
  const pwaSvgPath = path.join(assetsDir, 'rastro-pwa-icon.svg');

  console.log('Rendering 16:9 Logo PNG (1600x900)...');
  await sharp(logoSvgPath)
    .resize(1600, 900)
    .png({ quality: 100 })
    .toFile(path.join(assetsDir, 'rastro-logo-16-9.png'));

  console.log('Rendering PWA Icon 512x512...');
  await sharp(pwaSvgPath)
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(assetsDir, 'rastro-pwa-icon.png'));

  console.log('Rendering PWA Icon 192x192...');
  await sharp(pwaSvgPath)
    .resize(192, 192)
    .png({ quality: 100 })
    .toFile(path.join(assetsDir, 'rastro-pwa-icon-192.png'));

  console.log('Updating LOGOR.png for system wide compatibility...');
  fs.copyFileSync(
    path.join(assetsDir, 'rastro-logo-16-9.png'),
    path.join(assetsDir, 'LOGOR.png')
  );

  console.log('Done! All assets generated successfully.');
}

main().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
