import codecs
with open('lockring-search.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if len(line) > 1000:
            print(f'Line {i+1} is very long: {len(line)} characters')
        else:
            print(f'Line {i+1}: {line.strip()!r}')
