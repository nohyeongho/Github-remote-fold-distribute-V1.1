const fs = require('fs');
const file = 'd:/Github-remote-fold-distribute-V1.1/lockring-search.html';
const content = fs.readFileSync(file, 'utf8');

let lines = content.split(/\r?\n/);

// 1. .search-results 전역 속성에 overflow-x: auto 추가 (가로 스크롤 가능하게)
let globalStartIdx = -1;
let globalEndIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('.search-results {') && !lines[i].includes('@media')) {
        // @media 안의 .search-results가 아닌지 확인하기 위해 인덱스를 체크
        // 전역 속성은 보통 파일 앞쪽에 있음
        if (i < 600) {
            globalStartIdx = i;
        }
    }
    if (globalStartIdx !== -1 && i > globalStartIdx && lines[i].includes('}')) {
        globalEndIdx = i;
        break;
    }
}

if (globalStartIdx !== -1 && globalEndIdx !== -1) {
    lines.splice(globalStartIdx, globalEndIdx - globalStartIdx + 1,
        `    .search-results {
      flex: 1;
      overflow-y: auto;
      overflow-x: auto;
      padding: 24px;
    }`);
    console.log("Global CSS replaced.", globalStartIdx, globalEndIdx);
}

// 2. 모바일 미디어 쿼리 안에서 테이블에 min-width를 주고 단어 잘림 방지 스타일 적용
let inMedia = false;
let startIdx = -1;
let endIdx = -1;
let bracketCount = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@media (max-width: 768px)')) {
        inMedia = true;
    }
    if (inMedia && lines[i].includes('.search-results table {')) {
        startIdx = i;
    }
    if (startIdx !== -1 && i > startIdx) {
        if (lines[i].includes('}')) {
            bracketCount++;
        }
        // .search-results table { ... } 와 .search-results th, td { ... } 두 블록을 교체
        if (bracketCount === 2) {
            endIdx = i;
            break;
        }
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `      .search-results {
        padding: 16px;
      }
      .search-results table {
        font-size: 12px;
        min-width: 500px;
      }

      .search-results th,
      .search-results td {
        padding: 8px 6px;
        word-break: keep-all;
        white-space: nowrap;
      }`;
    lines.splice(startIdx, endIdx - startIdx + 1, replacement);
    console.log("Mobile CSS replaced.", startIdx, endIdx);
}

fs.writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log("Done.");
