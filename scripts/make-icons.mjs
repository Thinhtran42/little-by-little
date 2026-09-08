import sharp from 'sharp';
import fs from 'node:fs/promises';
const icon=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#285e46"/><path d="M174 161v190h85M294 161v190h51" fill="none" stroke="#e6edc9" stroke-width="42" stroke-linecap="round"/></svg>');
for(const size of [192,512])await sharp(icon).resize(size,size).png().toFile(`frontend/public/icon-${size}.png`);
await sharp(icon).resize(180,180).png().toFile('frontend/public/apple-touch-icon.png');

