const fs = require('fs');
const filepath = 'd:/Github-remote-fold-distribute-V1.1/lockring-search.html';
let content = fs.readFileSync(filepath, 'utf-8');

// 1. Mobile CSS: add CSS for table and adjust spot size for mobile
let cssToAdd = `
    /* Table styles for readability */
    .table-container {
      width: 100%;
      overflow-x: auto;
      margin-top: 12px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
      white-space: nowrap;
    }
    .info-table th, .info-table td {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
    }
    .info-table th {
      background: #f8fafc;
      font-weight: 700;
      color: #0f172a;
    }
    .info-table td {
      color: #444;
    }
`;
if (!content.includes('table-container')) {
    content = content.replace('/* Image Size for Tablet/Desktop */', cssToAdd + '\n    /* Image Size for Tablet/Desktop */');
}

// 2. Adjust spot sizes for mobile explicitly
let mediaIndex = content.lastIndexOf("/* Mobile Optimization */");
if (mediaIndex > -1) {
    let mediaEnd = content.indexOf("  </style>", mediaIndex);
    let newMedia = `/* Mobile Optimization */
    @media (max-width: 768px) {
      body { padding: 16px 12px; }
      header h1 { font-size: 22px; }
      .tab-bar { border-radius: 12px; }
      .tab-btn { padding: 10px 0; font-size: 13px; }
      .diagram-wrap { border-radius: 12px; max-width: 100%; }
      .spot { width: 16px !important; height: 16px !important; font-size: 9px !important; border-width: 1px !important; }
      .info-panel { flex-direction: column; padding: 20px 16px; gap: 16px; align-items: flex-start; text-align: left; }
      .info-panel .divider { display: none; }
      .info-panel .part-badge { font-size: 20px; min-width: 50px; height: 44px; }
      .info-panel .hint { font-size: 13px; }
    }
`;
    content = content.substring(0, mediaIndex) + newMedia + content.substring(mediaEnd);
}

// 3. Replace JS logic for rendering info
let jsStartStr = "let items = [];";
let jsStart = content.indexOf(jsStartStr);
let endJs = content.indexOf("panel.innerHTML = `", jsStart);

if (jsStart > -1 && endJs > jsStart) {
    let newJs = `let items = [];
          if (excelInfoList && Array.isArray(excelInfoList)) {
            items = excelInfoList;
          } else if (excelInfoList) {
            items = [excelInfoList];
          }

          if (items.length > 0) {
            extraHtml = \`
              <div class="table-container">
                <table class="info-table">
                  <thead>
                    <tr>
                      <th>Where to use</th>
                      <th>Part Number</th>
                      <th>Connector Name</th>
                      <th>Pipe (mm / inch)</th>
                    </tr>
                  </thead>
                  <tbody>
                    \${items.map(e => \`
                      <tr>
                        <td>\${e.whereToUse}</td>
                        <td>\${e.partNumber}</td>
                        <td>\${e.connectorName}</td>
                        <td>\${e.pipeMm} / \${e.pipeInch}</td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              </div>
            \`;
          }

          `;
    content = content.substring(0, jsStart) + newJs + content.substring(endJs);
}

fs.writeFileSync(filepath, content, 'utf-8');
console.log('Done!');
