import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Function to create an uncompressed/deflated raw PNG
function createPng(width, height, getPixel) {
  // getPixel(x, y) returns [r, g, b, a]
  const bytesPerPixel = 4;
  const stride = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(stride * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * stride;
    rawData[rowStart] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pxStart = rowStart + 1 + x * bytesPerPixel;
      rawData[pxStart] = r;
      rawData[pxStart + 1] = g;
      rawData[pxStart + 2] = b;
      rawData[pxStart + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const toCrc = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(toCrc), 0);
    return Buffer.concat([len, toCrc, crc]);
  }

  // Simple CRC32 implementation
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', deflated);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// Brand colors: Forest #173d34 (23, 61, 52), Gold #b48643 (180, 134, 67), Light Gold #d9b77d (217, 183, 125)
function getBrandPixel(x, y, size, isMaskable = false) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * (isMaskable ? 0.48 : 0.45);
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background is Forest #173d34
  let bg = [23, 61, 52, 255];

  // Draw rounded rect or circle icon badge
  if (!isMaskable) {
    const corner = size * 0.22;
    const qx = Math.max(0, Math.abs(dx) - (cx - corner));
    const qy = Math.max(0, Math.abs(dy) - (cy - corner));
    const dCorner = Math.sqrt(qx * qx + qy * qy);
    if (dCorner > corner) {
      return [0, 0, 0, 0]; // Transparent outside squircle
    }
  }

  // Draw stylized letter 'P' in center:
  // Stem: x from 0.35 to 0.45 * size, y from 0.28 to 0.72 * size
  const nx = x / size;
  const ny = y / size;

  const stem = nx >= 0.32 && nx <= 0.42 && ny >= 0.26 && ny <= 0.74;
  // Loop of P: outer circle centered at (0.42, 0.42) radius 0.18, inner radius 0.08
  const ldx = nx - 0.42;
  const ldy = ny - 0.42;
  const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
  const loop = ldist <= 0.18 && ldist >= 0.08 && nx >= 0.38;

  // Gold dot at (0.66, 0.70)
  const ddx = nx - 0.65;
  const ddy = ny - 0.68;
  const dot = Math.sqrt(ddx * ddx + ddy * ddy) <= 0.045;

  if (stem || loop) {
    return [255, 255, 255, 255]; // Crisp white P
  }
  if (dot) {
    return [217, 183, 125, 255]; // Gold dot
  }

  // Inner subtle border
  if (dist > r - 2 && dist <= r) {
    return [217, 183, 125, 120];
  }

  return bg;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192
const png192 = createPng(192, 192, (x, y) => getBrandPixel(x, y, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

// Generate 512x512
const png512 = createPng(512, 512, (x, y) => getBrandPixel(x, y, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

// Generate Maskable 512x512 (with safe margins)
const pngMaskable = createPng(512, 512, (x, y) => getBrandPixel(x, y, 512, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable);

// Apple touch icon (180x180)
const png180 = createPng(180, 180, (x, y) => getBrandPixel(x, y, 180, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

// Favicon 64x64 as png renamed/copied
const favicon = createPng(64, 64, (x, y) => getBrandPixel(x, y, 64, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon);

console.log('Successfully generated all PWA PNG icons!');
