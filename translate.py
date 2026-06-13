import json
import time
from deep_translator import GoogleTranslator

# Read expressionsData.js
with open('./src/data/expressionsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Very hacky parsing since it's JS and not pure JSON
# But since I know the format, I can extract the array
start_idx = content.find('[')
json_str = content[start_idx:content.rfind(']')+1]
try:
    # Need to convert JS object to JSON
    # This might fail if keys aren't quoted. Let's just use regex to add quotes.
    import re
    json_str = re.sub(r'(\w+):', r'"\1":', json_str)
    # Fix single quotes to double quotes for values
    json_str = json_str.replace("'", '"')
    data = json.loads(json_str)
except Exception as e:
    print("Error parsing JS", e)
    exit(1)

langs = ['pt', 'it', 'es', 'fr', 'am', 'ar', 'tr', 'ku', 'fa', 'lv', 'ru', 'ur'] # Google Translator uses different codes sometimes but these are standard

for cat in data:
    for item in cat['items']:
        if 'translations' not in item:
            item['translations'] = {'en': item['english']}
        
        for lang in langs:
            if lang not in item['translations']:
                try:
                    res = GoogleTranslator(source='de', target=lang).translate(item['deutsch'])
                    item['translations'][lang] = res
                    time.sleep(0.5)
                except Exception as e:
                    print(f"Error for {lang}: {e}")
        print(f"Translated {item['deutsch']}")

# Write back
with open('./src/data/expressionsData.js', 'w', encoding='utf-8') as f:
    f.write("export const expressionsData = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n")
print("Done")
