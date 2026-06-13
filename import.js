import fs from 'fs';
const data = JSON.parse(fs.readFileSync('data_out.json', 'utf8'));
const content = `export const expressionsData = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync('./src/data/expressionsData.js', content);
console.log('Successfully updated expressionsData.js');
