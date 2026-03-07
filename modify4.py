import re

filepath = 'd:/Github-remote-fold-distribute-V1.1/lockring-search.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace .spot CSS
spot_pattern = re.compile(r'\.spot\s*\{.*?z-index:\s*10;\s*\}', re.DOTALL)
spot_replacement = r""".spot {
      position: absolute;
      transform: translate(-50%, -50%);
      width: clamp(20px, 3.5vw, 35px);
      height: clamp(20px, 3.5vw, 35px);
      border-radius: 50%;
      background: #A50034;
      border: 2px solid #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Noto Sans KR', sans-serif;
      font-size: clamp(10px, 1.5vw, 16px);
      font-weight: 700;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(165, 0, 52, 0.25);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, background 0.2s;
      z-index: 10;
    }"""
content, count = spot_pattern.subn(spot_replacement, content)
print(f"Replaced .spot: {count} times")

# 2. Replace JS
js_pattern = re.compile(r'if \([^)]+\s*&&\s*Array\.isArray[^)]+\)\s*\{.*?else if\s*\([^)]+\)\s*\{.*?\`\s*;[^}]*\}', re.DOTALL)
js_replacement = r"""let items = [];
          if (excelInfoList && Array.isArray(excelInfoList)) {
            items = excelInfoList;
          } else if (excelInfoList) {
            items = [excelInfoList];
          }

          if (items.length > 0) {
            const makeMultilineRow = (label, valueFn) => {
              const vals = items.map(valueFn);
              const uniqueVals = [...new Set(vals)];
              if (uniqueVals.length === 1) {
                return `<p><strong>${label}:</strong> ${uniqueVals[0]}</p>`;
              }
              return `<p><strong>${label}:</strong><br><span style="padding-left:14px; color:#A50034;">●</span> ${uniqueVals.join('<br><span style="padding-left:14px; color:#A50034;">●</span> ')}</p>`;
            };

            extraHtml = `
              <div class="excel-info">
                ${makeMultilineRow('Where to use', e => e.whereToUse)}
                ${makeMultilineRow('Part Number', e => e.partNumber)}
                ${makeMultilineRow('Connector Name', e => e.connectorName)}
                ${makeMultilineRow('Pipe (mm / inch)', e => `${e.pipeMm} / ${e.pipeInch}`)}
              </div>
            `;
          }"""
content, count = js_pattern.subn(js_replacement, content)
print(f"Replaced JS: {count} times")

# 3. Replace @media duplicate
# Find the FIRST occurrence of "/* Mobile Optimization */" and replace from there to the closing tag of media query
# Wait, actually we can just match the entire block:
media_pattern = re.compile(r'/\*\s*Mobile Optimization\s*\*/\s*@media[^{]+\{.*?\.info-panel \.hint\s*\{[^}]+\}.*?\}', re.DOTALL)
# It appears twice. We replace all occurrences with a single one (since they are identical).
# But be careful not to delete both if they are needed once.
# Wait, the duplicate is right next to each other.
media_replacement = r"""/* Mobile Optimization */
    @media (max-width: 768px) {
      body { padding: 16px 12px; }
      header h1 { font-size: 22px; }
      .tab-bar { border-radius: 12px; }
      .tab-btn { padding: 10px 0; font-size: 13px; }
      .diagram-wrap { border-radius: 12px; max-width: 100%; }
      .info-panel { flex-direction: column; padding: 20px 16px; gap: 16px; align-items: flex-start; text-align: left; }
      .info-panel .divider { display: none; }
      .info-panel .part-badge { font-size: 20px; min-width: 50px; height: 44px; }
      .info-panel .hint { font-size: 13px; }
    }"""
# Just replace the duplicated text with a single text.
double_media = re.compile(r'(/\*\s*Mobile Optimization\s*\*/\s*@media[^{]+\{.*?\})\s*(/\*\s*Mobile Optimization\s*\*/\s*@media[^{]+\{.*?\})', re.DOTALL)
content, count = double_media.subn(media_replacement, content)

# If it didn't match the double one, just replace the single media block too, so it gets the `max-width: 100%` on wrap
if count == 0:
    content, count = media_pattern.subn(media_replacement, content)

print(f"Replaced Media Block: {count} times")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
