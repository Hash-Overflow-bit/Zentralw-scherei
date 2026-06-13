import fs from 'fs';
import { expressionsData } from './src/data/expressionsData.js';
import { translate } from '@vitalets/google-translate-api';

const langs = ['pt', 'it', 'es', 'fr', 'am', 'ti', 'ar', 'tr', 'ku', 'fa', 'lv', 'ru', 'ur'];

async function run() {
  for (let cat of expressionsData) {
    const batchSize = 5;
    for (let i = 0; i < cat.items.length; i += batchSize) {
      const batch = cat.items.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (item) => {
        if (!item.translations || Object.keys(item.translations).length < langs.length + 1) {
            item.translations = item.translations || { en: item.english };
            await Promise.all(langs.map(async (lang) => {
              try {
                const res = await translate(item.deutsch, { from: 'de', to: lang });
                item.translations[lang] = res.text;
              } catch (e) {
                console.error('Error translating to ' + lang + ' for ' + item.deutsch, e.message);
              }
            }));
            console.log(`Translated: ${item.deutsch}`);
        } else {
            console.log(`Skipped: ${item.deutsch}`);
        }
      }));
      // Optional small delay between batches
      await new Promise(r => setTimeout(r, 200));
    }
  }
  
  const content = `export const expressionsData = ${JSON.stringify(expressionsData, null, 2)};\n`;
  fs.writeFileSync('./src/data/expressionsData.js', content);
  console.log('Done translating!');
}
run();
