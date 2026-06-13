import fs from 'fs';
import { expressionsData } from './src/data/expressionsData.js';
fs.writeFileSync('data.json', JSON.stringify(expressionsData, null, 2));
