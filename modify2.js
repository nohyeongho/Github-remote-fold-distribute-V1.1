const fs = require('fs');
const filepath = 'd:/Github-remote-fold-distribute-V1.1/lockring-search.html';
let content = fs.readFileSync(filepath, 'utf-8');

// replace .spot
content = content.replace(/\.spot\s*\{[\s\S]*?z-index:\s*10;\s*\}/, `.spot {
      position: absolute;
      transform: translate(-50%, -50%);
      width: clamp(20px, 3vw, 32px);
      height: clamp(20px, 3vw, 32px);
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
    }`);

let mediaRe = /\/\*\s*Mobile Optimization\s*\*\/[\s\S]*?\}\s*\/\*\s*Mobile Optimization\s*\*\/[\s\S]*?\}/;
content = content.replace(mediaRe, `/* Mobile Optimization */
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
    }`);

let jsRe = /if\s*\(excelInfoList\s*&&\s*Array\.isArray\(excelInfoList\)\)\s*\{[\s\S]*?\}\s*else\s*if\s*\(excelInfoList\)\s*\{[\s\S]*?\}/;
let r3 = `let items = [];
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
                return \`<p><strong>\${label}:</strong> \${uniqueVals[0]}</p>\`;
              }
              return \`<p><strong>\${label}:</strong><br><span style="padding-left:14px; color:#A50034;">●</span> \${uniqueVals.join('<br><span style="padding-left:14px; color:#A50034;">●</span> ')}</p>\`;
            };

            extraHtml = \`
              <div class="excel-info">
                \${makeMultilineRow('Where to use', e => e.whereToUse)}
                \${makeMultilineRow('Part Number', e => e.partNumber)}
                \${makeMultilineRow('Connector Name', e => e.connectorName)}
                \${makeMultilineRow('Pipe (mm / inch)', e => \`\${e.pipeMm} / \${e.pipeInch}\`)}
              </div>
            \`;
          }`;
content = content.replace(jsRe, r3);

fs.writeFileSync(filepath, content, 'utf-8');
console.log('Done with regex replacements!');
