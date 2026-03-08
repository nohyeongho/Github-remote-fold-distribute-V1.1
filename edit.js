const fs = require('fs');
const targetFile = 'd:\\\\Github-remote-fold-distribute-V1.1\\\\lockring-search.html';
let lines = fs.readFileSync(targetFile, 'utf8').split(/\\r?\\n/);

// Find and replace .info-table
let infoTableIdx = lines.findIndex(l => l.includes('.info-table {'));
if (infoTableIdx !== -1) {
  for (let i = infoTableIdx; i < infoTableIdx + 15 && i < lines.length; i++) {
    if (lines[i].includes('white-space: nowrap;')) {
      lines[i] = lines[i].replace('white-space: nowrap;', 'white-space: normal;\\n      word-break: keep-all;');
      console.log('Fixed info-table');
      break;
    }
  }
}

// Find Mobile Optimization
let mediaIdx = lines.findIndex(l => l.includes('/* Mobile Optimization */'));
if (mediaIdx !== -1) {
  let openBrackets = 0;
  let endMediaIdx = -1;
  for (let i = mediaIdx + 1; i < lines.length; i++) {
    openBrackets += (lines[i].match(/\\{/g) || []).length;
    openBrackets -= (lines[i].match(/\\}/g) || []).length;
    if (openBrackets === 0 && lines[i].includes('}')) {
      endMediaIdx = i;
      break;
    }
  }

  if (endMediaIdx !== -1) {
    const newMobileCSS = `    /* Mobile Optimization */
    @media (max-width: 768px) {
      body {
        padding: 12px 8px;
        position: relative;
      }
      header {
        margin-bottom: 12px;
      }
      header h1 {
        font-size: 20px;
      }
      header p {
        font-size: 12px;
        word-break: keep-all;
      }
      .tab-bar {
        border-radius: 12px;
        width: 100%;
        margin-bottom: 8px;
        box-sizing: border-box;
      }
      .tab-btn {
        padding: 10px 0;
        font-size: 14px;
      }
      .diagram-wrap {
        border-radius: 12px;
        max-width: 100%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }
      .spot {
        border-width: 1px !important;
      }
      .info-panel {
        flex-direction: column;
        padding: 16px;
        gap: 12px;
        align-items: flex-start;
        text-align: left;
        width: 100%;
        box-sizing: border-box;
      }
      .info-panel .divider {
        display: none;
      }
      .info-panel .part-badge {
        font-size: 18px;
        min-width: 48px;
        height: 40px;
      }
      .info-panel .hint {
        font-size: 12px;
      }
      .pkg-search-btn {
        position: relative !important;
        top: auto !important;
        right: auto !important;
        width: 100% !important;
        margin-bottom: 16px !important;
        padding: 12px !important;
        font-size: 15px !important;
        justify-content: center !important;
        border-radius: 12px !important;
        box-sizing: border-box;
      }
      .info-table {
        font-size: 12px;
        width: 100%;
      }
      .info-table th,
      .info-table td {
        padding: 6px 8px;
      }
      .search-results {
        padding: 12px;
      }
      .search-results table {
        font-size: 12px;
      }
      .search-results th,
      .search-results td {
        padding: 8px 6px;
      }
    }`;
    lines.splice(mediaIdx, endMediaIdx - mediaIdx + 1, newMobileCSS);
    console.log('Fixed mobile css');
  }
}

// Check for missing button
let hasBtn = lines.some(l => l.includes('id="pkgSearchBtn"'));
let headerEndIdx = lines.findIndex(l => l.includes('</header>'));
if (!hasBtn && headerEndIdx !== -1) {
  const btnHtml = `  <button id="pkgSearchBtn" class="pkg-search-btn" onclick="toggleSearchModal(true)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px; margin-right:6px; vertical-align:middle;">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
    패키지 자재 검색
  </button>`;
  lines.splice(headerEndIdx + 1, 0, btnHtml);
  console.log('Added pkgSearchBtn');
} else {
  console.log('Button found or header not found');
}

fs.writeFileSync(targetFile, lines.join('\\r\\n'), 'utf8');
console.log('Done');
