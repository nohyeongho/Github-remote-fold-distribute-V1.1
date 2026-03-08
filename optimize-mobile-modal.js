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
    // 미디어 쿼리 끝부분(스타일 닫기 직전)에 추가적인 모바일 스타일 삽입
    if (inMedia && lines[i].trim() === '}') {
        insertIdx = i;
    }
}

if (insertIdx !== -1) {
    const extraMobileStyles = `
      /* Search Modal Mobile Optimization */
      .search-header {
        padding: 16px;
      }
      .search-input {
        padding: 10px 16px 10px 40px;
        font-size: 14px;
        border-radius: 10px;
      }
      .search-icon-fixed {
        left: 12px;
        width: 16px;
        height: 16px;
      }
      .search-close {
        margin-left: 10px;
        font-size: 20px;
      }
      .search-results {
        padding: 12px;
      }
  `;

    lines.splice(insertIdx, 0, extraMobileStyles);
    fs.writeFileSync(file, lines.join('\r\n'), 'utf8');
    console.log("Extra mobile optimization styles added.");
}
