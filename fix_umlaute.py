import glob, json

# Mapping: Mojibake -> korrekte Umlaute
replacements = {
    'Ã¤': 'ä',
    'Ã¶': 'ö',
    'Ã¼': 'ü',
    'Ã„': 'Ä',
    'Ã–': 'Ö',
    'Ãœ': 'Ü',
    'ÃŸ': 'ß',
    'Ã ': 'à ',
    'â€': '–',  # Gedankenstrich
    'â„¢': '™',
    'Ã©': 'é',
}

for f in sorted(glob.glob('projects/**/project.json', recursive=True)):
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    original = content
    for wrong, correct in replacements.items():
        content = content.replace(wrong, correct)
    
    if content != original:
        print(f'Korrigiere: {f}')
        data = json.loads(content)
        with open(f, 'w', encoding='utf-8') as fh:
            json.dump(data, fh, indent=2, ensure_ascii=False)
        print(f'  -> Gespeichert')
    else:
        print(f'OK: {f}')

print('Fertig!')
