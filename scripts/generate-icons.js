const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create ICO buffer from an array of PNG buffers
function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // count of images

  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // size of image in bytes
    entry.writeUInt32LE(offset, 12); // offset from beginning of file
    entries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((img) => img.buffer)]);
}

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const logoPath = path.join(rootDir, 'public', 'sahelimile-logo.jpeg');

  if (!fs.existsSync(logoPath)) {
    throw new Error('Logo not found at ' + logoPath);
  }

  console.log('Loading logo from:', logoPath);
  const { data, info } = await sharp(logoPath).raw().toBuffer({ resolveWithObject: true });

  const targetR = 253, targetG = 248, targetB = 231; // #FDF8E7 warm cream

  // The badge circle is centered at cx = 511.5, cy = 537 in 1024x1024
  // Shift by -25px to center at (511.5, 512)
  const shiftY = -25;
  const cx = 511.5, cy = 512;
  const rInner = 407;
  const rOuter = 412;

  // 1. Create master centered standard image (1024x1024) with outer corners filled with #FDF8E7
  const standardBuffer = Buffer.alloc(1024 * 1024 * 4);

  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const srcY = y - shiftY;
      const outIdx = (y * 1024 + x) * 4;
      const dist = Math.hypot(x - cx, y - cy);

      if (srcY < 0 || srcY >= info.height || dist >= rOuter) {
        standardBuffer[outIdx] = targetR;
        standardBuffer[outIdx + 1] = targetG;
        standardBuffer[outIdx + 2] = targetB;
        standardBuffer[outIdx + 3] = 255;
      } else if (dist <= rInner) {
        const srcIdx = (srcY * info.width + x) * info.channels;
        standardBuffer[outIdx] = data[srcIdx];
        standardBuffer[outIdx + 1] = data[srcIdx + 1];
        standardBuffer[outIdx + 2] = data[srcIdx + 2];
        standardBuffer[outIdx + 3] = 255;
      } else {
        const t = (dist - rInner) / (rOuter - rInner);
        const srcIdx = (srcY * info.width + x) * info.channels;
        standardBuffer[outIdx] = Math.round((1 - t) * data[srcIdx] + t * targetR);
        standardBuffer[outIdx + 1] = Math.round((1 - t) * data[srcIdx + 1] + t * targetG);
        standardBuffer[outIdx + 2] = Math.round((1 - t) * data[srcIdx + 2] + t * targetB);
        standardBuffer[outIdx + 3] = 255;
      }
    }
  }

  const standardSharp = sharp(standardBuffer, {
    raw: { width: 1024, height: 1024, channels: 4 },
  });

  // 2. Create master maskable image (1024x1024) with ~15% safe-zone padding
  // Crop the 822x822 circular badge from standardSharp
  const badgeCroppedBuffer = await standardSharp
    .clone()
    .extract({ left: 101, top: 101, width: 822, height: 822 })
    .png()
    .toBuffer();

  // Target diameter for 15% padding on 1024 canvas = 1024 * (1 - 2 * 0.15) = 717px
  const badgeScaledBuffer = await sharp(badgeCroppedBuffer)
    .resize(717, 717, { fit: 'contain' })
    .png()
    .toBuffer();

  // Composite onto 1024x1024 #FDF8E7 background canvas
  const maskableBase = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: targetR, g: targetG, b: targetB, alpha: 1 },
    },
  })
    .composite([
      {
        input: badgeScaledBuffer,
        gravity: 'centre',
      },
    ])
    .png()
    .toBuffer();

  const maskableSharp = sharp(maskableBase);

  // Ensure output directories exist
  const publicDir = path.join(rootDir, 'public');
  const iconsDir = path.join(publicDir, 'icons');
  const appDir = path.join(rootDir, 'src', 'app');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

  console.log('Generating PNG icons...');

  // Standard 512x512
  const icon512 = await standardSharp.clone().resize(512, 512).png({ quality: 100, compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);
  fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), icon512);
  console.log('✓ Wrote icon-512.png (512x512)');

  // Standard 192x192
  const icon192 = await standardSharp.clone().resize(192, 192).png({ quality: 100, compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
  fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), icon192);
  console.log('✓ Wrote icon-192.png (192x192)');

  // Maskable 512x512 (with 15% safe zone padding)
  const iconMaskable512 = await maskableSharp.clone().resize(512, 512).png({ quality: 100, compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), iconMaskable512);
  fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), iconMaskable512);
  console.log('✓ Wrote icon-maskable-512.png (512x512, 15% padding)');

  // Maskable 192x192
  const iconMaskable192 = await maskableSharp.clone().resize(192, 192).png({ quality: 100, compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-maskable-192.png'), iconMaskable192);
  fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192x192.png'), iconMaskable192);
  console.log('✓ Wrote icon-maskable-192.png (192x192, 15% padding)');

  // Apple Touch Icon (180x180)
  const appleTouchIcon = await standardSharp.clone().resize(180, 180).png({ quality: 100, compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);
  fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleTouchIcon);
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), appleTouchIcon);
  console.log('✓ Wrote apple-touch-icon.png (180x180)');

  // Generate multi-size Favicon (48x48, 32x32, 16x16)
  const fav48 = await standardSharp.clone().resize(48, 48).png().toBuffer();
  const fav32 = await standardSharp.clone().resize(32, 32).png().toBuffer();
  const fav16 = await standardSharp.clone().resize(16, 16).png().toBuffer();

  const icoBuffer = createIco([
    { width: 48, height: 48, buffer: fav48 },
    { width: 32, height: 32, buffer: fav32 },
    { width: 16, height: 16, buffer: fav16 },
  ]);

  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Wrote favicon.ico to src/app/ and public/');

  // Also update public/icon.svg to embed the 512 PNG as base64 so any SVG fallback displays the real brand logo
  const b64 = icon512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#FDF8E7"/>
  <image href="data:image/png;base64,${b64}" width="512" height="512"/>
</svg>\n`;
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');
  console.log('✓ Updated public/icon.svg with new brand logo');

  console.log('\nAll icons successfully generated!');
}

main().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
