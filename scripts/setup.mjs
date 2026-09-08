import fs from 'node:fs';
import {randomBytes} from 'node:crypto';
if(!fs.existsSync('.env')){const password=randomBytes(24).toString('hex');fs.writeFileSync('.env',`POSTGRES_PASSWORD=${password}\nDATABASE_URL=postgresql://little_app:${password}@127.0.0.1:54329/little_english\nPORT=3001\n`);console.log('Created local .env with a random database password.');}else console.log('.env already exists; preserved.');
