import json
import time
from deep_translator import GoogleTranslator, MyMemoryTranslator

with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

langs = ['pt', 'it', 'es', 'fr', 'am', 'ti', 'ar', 'tr', 'ku', 'fa', 'lv', 'ru', 'ur'] 

for cat in data:
    for item in cat['items']:
        if 'translations' not in item:
            item['translations'] = {'en': item.get('english', '')}
        
        for lang in langs:
            target_lang = lang
            if lang not in item['translations']:
                try:
                    res = GoogleTranslator(source='de', target=target_lang).translate(item['deutsch'])
                    item['translations'][lang] = res
                except Exception as e:
                    try:
                        res = MyMemoryTranslator(source='de', target=target_lang).translate(item['deutsch'])
                        item['translations'][lang] = res
                    except Exception as e2:
                        pass
                time.sleep(0.4) 
        print(f"Translated {item['deutsch']}")

with open('data_out.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print("Done")
