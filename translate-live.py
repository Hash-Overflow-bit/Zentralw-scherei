import json
import time
import os
from deep_translator import GoogleTranslator, MyMemoryTranslator

with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

langs = ['pt', 'it', 'es', 'fr', 'am', 'ti', 'ar', 'tr', 'ku', 'fa', 'lv', 'ru', 'ur']

def save_data():
    with open('./src/data/expressionsData.js', 'w', encoding='utf-8') as f:
        f.write("export const expressionsData = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n")

for cat in data:
    for item in cat['items']:
        if 'translations' not in item:
            item['translations'] = {'en': item.get('english', '')}
        
        updated = False
        for lang in langs:
            target_lang = lang
            if lang not in item['translations']:
                try:
                    res = GoogleTranslator(source='de', target=target_lang).translate(item['deutsch'])
                    item['translations'][lang] = res
                    updated = True
                except Exception as e:
                    try:
                        res = MyMemoryTranslator(source='de', target=target_lang).translate(item['deutsch'])
                        item['translations'][lang] = res
                        updated = True
                    except Exception as e2:
                        pass
                time.sleep(0.4)
        
        if updated:
            print(f"Translated {item['deutsch']}", flush=True)
            save_data()

print("Done", flush=True)
