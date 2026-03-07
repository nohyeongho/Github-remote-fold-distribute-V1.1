const fs = require('fs');
const filepath = 'd:/Github-remote-fold-distribute-V1.1/lockring-search.html';
let content = fs.readFileSync(filepath, 'utf-8');
content = content.replace(/\r\n/g, '\n');

const t1 = `    /* Spot buttons */
    .spot {
      position: absolute;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #A50034;
      border: 2px solid #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 9px;
      font-weight: 700;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(165, 0, 52, 0.25);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, background 0.2s;
      z-index: 10;
    }

    .spot:hover,
    .spot.active {
      transform: translate(-50%, -50%) scale(1.3);
      box-shadow: 0 0 0 4px rgba(165, 0, 52, 0.12), 0 4px 10px rgba(165, 0, 52, 0.2);
      background: #C5003E;
    }`;

const r1 = `    /* Spot buttons */
    .spot {
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
    }

    .spot:hover,
    .spot.active {
      transform: translate(-50%, -50%) scale(1.3);
      box-shadow: 0 0 0 4px rgba(165, 0, 52, 0.12), 0 4px 10px rgba(165, 0, 52, 0.2);
      background: #C5003E;
    }`;

const t2 = `    /* Mobile Optimization */
    @media (max-width: 768px) {
      body { padding: 16px 12px; }
      header h1 { font-size: 22px; }
      .tab-bar { border-radius: 12px; }
      .tab-btn { padding: 10px 0; font-size: 13px; }
      .diagram-wrap { border-radius: 12px; max-width: 100%; }
      .spot { width: 24px; height: 24px; font-size: 11px; }
      .info-panel { flex-direction: column; padding: 20px 16px; gap: 16px; align-items: flex-start; text-align: left; }
      .info-panel .divider { display: none; }
      .info-panel .part-badge { font-size: 20px; min-width: 50px; height: 44px; }
      .info-panel .hint { font-size: 13px; }
    }
    /* Mobile Optimization */
    @media (max-width: 768px) {
      body { padding: 16px 12px; }
      header h1 { font-size: 22px; }
      .tab-bar { border-radius: 12px; }
      .tab-btn { padding: 10px 0; font-size: 13px; }
      .diagram-wrap { border-radius: 12px; }
      .spot { width: 24px; height: 24px; font-size: 11px; }
      .info-panel { flex-direction: column; padding: 20px 16px; gap: 16px; align-items: flex-start; text-align: left; }
      .info-panel .divider { display: none; }
      .info-panel .part-badge { font-size: 20px; min-width: 50px; height: 44px; }
      .info-panel .hint { font-size: 13px; }
    }`;

const r2 = `    /* Mobile Optimization */
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
    }`;

const t3 = `          if (excelInfoList && Array.isArray(excelInfoList)) {
            extraHtml = excelInfoList.map(excelInfo => \`
              <div class="excel-info">
                <p><strong>Where to use:</strong> \${excelInfo.whereToUse}</p>
                <p><strong>Part Number:</strong> \${excelInfo.partNumber}</p>
                <p><strong>Connector Name:</strong> \${excelInfo.connectorName}</p>
                <p><strong>Pipe (mm / inch):</strong> \${excelInfo.pipeMm} / \${excelInfo.pipeInch}</p>
              </div>
            \`).join('');
          } else if (excelInfoList) {
            // Fallback for single object if needed
            extraHtml = \`
              <div class="excel-info">
                <p><strong>Where to use:</strong> \${excelInfoList.whereToUse}</p>
                <p><strong>Part Number:</strong> \${excelInfoList.partNumber}</p>
                <p><strong>Connector Name:</strong> \${excelInfoList.connectorName}</p>
                <p><strong>Pipe (mm / inch):</strong> \${excelInfoList.pipeMm} / \${excelInfoList.pipeInch}</p>
              </div>
            \`;
          }`;

const r3 = `          let items = [];
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

console.log('t1 found:', content.includes(t1));
console.log('t2 found:', content.includes(t2));
console.log('t3 found:', content.includes(t3));

content = content.replace(t1, r1);
content = content.replace(t2, r2);
content = content.replace(t3, r3);

fs.writeFileSync(filepath, content, 'utf-8');
console.log('HTML file successfully replaced.');
