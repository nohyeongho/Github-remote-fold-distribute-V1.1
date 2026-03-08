const fs = require('fs');
const file = 'd:/Github-remote-fold-distribute-V1.1/lockring-search.html';
const content = fs.readFileSync(file, 'utf8');

let lines = content.split(/\r?\n/);
let inMedia = false;
let insertIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@media (max-width: 768px)')) {
        inMedia = true;
    }
    if (inMedia && lines[i].trim() === '}') {
        insertIdx = i;
    }
}

if (insertIdx !== -1) {
    const finalCompactStyles = `
      /* Additional Compact Styles for Mobile */
      .info-panel {
        padding: 16px;
        gap: 12px;
      }
      .info-panel .part-badge {
        font-size: 16px;
        min-width: 40px;
        height: 34px;
        border-radius: 8px;
      }
      .info-panel .info-content h3 {
        font-size: 18px;
      }
      .info-table th, .info-table td {
        padding: 4px 6px;
        font-size: 11px;
      }
  `;

    lines.splice(insertIdx, 0, finalCompactStyles);
    fs.writeFileSync(file, lines.join('\r\n'), 'utf8');
    console.log("Final compact mobile styles added.");
}
